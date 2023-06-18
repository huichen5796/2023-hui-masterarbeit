from py2neo import Graph
import json
import pandas
import time
import copy
from .load_pre_post_data import load_pp_data
from .load_process import load_process_data
from .json_to_neo import json_to_neo


class FeedOneExp:
    def __init__(self, index, pre_data_path, post_data_path, process_path, cpa):
        self.config_account_path = 'development/config/config_account.json'
        self.config_cryo_db_path = 'development/config/config_cryo_db.json'
        self.index = index
        self.pre_data_path = pre_data_path
        self.post_data_path = post_data_path
        self.process_path = process_path
        self.cpa = cpa
        self.graph = self.connect_to_db()
        self.config_data = self.load_config_data()

    def connect_to_db(self):
        with open(self.config_account_path, 'r') as f:
            data = json.load(f)
        graph = Graph(data['profile'], password=data['password'])
        return graph

    def load_config_data(self):
        with open(self.config_cryo_db_path, 'r') as f:
            data = json.load(f)
        if data['PostData'] == '$PreData':
            data['PostData'] = copy.deepcopy(data['PreData'])
        return data

    def load_one_experiment(self):
        loaded_data = self.config_data
        loaded_data['PreData'] = load_pp_data(
            self.pre_data_path, self.config_data['PreData'])
        loaded_data['PostData'] = load_pp_data(
            self.post_data_path, self.config_data['PostData'])
        loaded_data['CPA'] = self.cpa
        loaded_data['Process'] = load_process_data(
            self.process_path, self.config_data['Process'])
        return loaded_data

    def feed_to_neo4j(self):
        loaded_data = self.load_one_experiment()
        json_to_neo(self.graph, loaded_data, self.index)


def get_continue_index(df, load_from):
    if load_from == 'start':
        return 0
    else:
        if len(df.index[df['index'] == load_from]) == 1:
            return (df.index[df['index'] == load_from])[0]
        else:
            return 'OverflowError'


def feed_all_exps(exps_log_path, load_from):
    experiments_df = pandas.read_csv(exps_log_path)

    continue_index = get_continue_index(experiments_df, load_from)

    if continue_index == 'OverflowError':
        print(f'\nError: {load_from} does not exist.\n')
    else:
        if continue_index == 0:
            first_exp = experiments_df['index'][0]
            print(f'\nStart: from {first_exp}.\n')
        else:
            print(f'\nContinue: from {load_from}.\n')
        start = time.perf_counter()
        overall_time = 0
        for i, line in experiments_df.iterrows():
            if i < continue_index:
                continue
            else:
                FeedOneExp(index=experiments_df['index'][i],
                           pre_data_path=experiments_df['pre_data'][i],
                           post_data_path=experiments_df['post_data'][i],
                           process_path=experiments_df['process'][i],
                           cpa=experiments_df['cpa'][i]).feed_to_neo4j()
                # progress bar
                finish = '▓' * int((i+1)*(50/len(experiments_df)))
                need_do = '-' * (50-int((i+1)*(50/len(experiments_df))))
                dur = time.perf_counter() - start
                overall_time = overall_time + dur
                print("\r{}/{}|{}{}|{:.2f}s".format((i+1), len(experiments_df),
                                                    finish, need_do, overall_time), end='', flush=True)

        dur = time.perf_counter() - start
        print('')
        print(f'\nEnd: overall time {dur:.2f}s, average time {overall_time/(i+1):.2f}s.\n')
