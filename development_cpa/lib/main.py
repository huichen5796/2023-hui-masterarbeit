from py2neo import Graph
import json
import os
import time
from .load_dsc_data import load_dsc_data
from .load_ftir_data import load_ftir_data
from .load_cryomicro_data import load_cryomicro_data
from .load_osmo_data import load_osmo_data
from .load_visc_data import load_visc_data
from .json_to_neo import json_to_neo


class FeedOneExp:
    def __init__(self, cpa_index, cpa_dir_path):
        self.config_account_path = 'development_cpa/config/config_account.json'
        self.config_cryo_db_path = 'development_cpa/config/config_cpa_db.json'
        self.cpa_dir_path = cpa_dir_path
        self.cpa_index = cpa_index
        self._path = self.get_paths()
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
        return data
    
    def get_paths(self):
        return {
            "dsc_path": f'{self.cpa_dir_path}/{self.cpa_index}/DSC/' + os.listdir(f'{self.cpa_dir_path}/{self.cpa_index}/DSC')[0],
            "ftir_path": f'{self.cpa_dir_path}/{self.cpa_index}/FTIR/' + os.listdir(f'{self.cpa_dir_path}/{self.cpa_index}/FTIR')[0],
            "cryomicro_path": '',
            "osmo_path": '',
            "visc_path": ''
        }

    def load_one_experiment(self):
        loaded_data = self.config_data
        loaded_data['CPA ID'] = self.cpa_index
        loaded_data['DSC'] = load_dsc_data(
            self._path['dsc_path'], self.config_data['DSC'])
        loaded_data['FTIR'] = load_ftir_data(
            self._path['ftir_path'], self.config_data['FTIR'])
        loaded_data['Cryomicroscopy'] = load_cryomicro_data(
            self._path['cryomicro_path'], self.config_data['Cryomicroscopy'])
        loaded_data['Osmolality'] = load_osmo_data(
            self._path['osmo_path'], self.config_data['Osmolality'])
        loaded_data['Viscosity'] = load_visc_data(
            self._path['visc_path'], self.config_data['Viscosity'])

        return loaded_data

    def feed_to_neo4j(self):
        loaded_data = self.load_one_experiment()
        json_to_neo(self.graph, loaded_data)


def feed_all_exps(cpa_dir_path):
    cpa_dirs = os.listdir(cpa_dir_path)
    print(f'\nStart: {len(cpa_dirs)} exist.')

    start = time.perf_counter()
    overall_time = 0
    for i, dir_name in enumerate(cpa_dirs):
        if i == 0:
            FeedOneExp(cpa_index=dir_name,
                        cpa_dir_path=cpa_dir_path).feed_to_neo4j()
        # progress bar
        finish = '▓' * int((i+1)*(50/len(cpa_dirs)))
        need_do = '-' * (50-int((i+1)*(50/len(cpa_dirs))))
        dur = time.perf_counter() - start
        overall_time = overall_time + dur
        print("\r{}/{}|{}{}|{:.2f}s".format((i+1), len(cpa_dirs),
                                            finish, need_do, overall_time), end='', flush=True)

    dur = time.perf_counter() - start
    print('')
    print(f'\nEnd: overall time {dur:.2f}s, average time {overall_time/(i+1):.2f}s.\n')
