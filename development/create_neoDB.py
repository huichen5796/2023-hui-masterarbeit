from py2neo import Graph, Node, Relationship
import json


class NeoDB:
    def __init__(self):
        self.config_path = 'development/config.json'
        self.graph = self.connect_to_db()
        
    def connect_to_db(self):
        with open(self.config_path, 'r') as f:
            data = json.load(f)
        graph = Graph(data['profile'], password= data['password'])
        return graph
    
    def db_init(self):
        self.graph.run('DROP CONSTRAINT ON (n: ${nodeType}) ASSERT n.name IS UNIQUE')
    
    def query_init(self):
        node_counts = self.graph.run("MATCH (n) RETURN DISTINCT labels(n) AS label, count(*) AS count").data()
        print("node:")
        for result in node_counts:
            label = result['label'][0]
            count = result['count']
            print(f"{label}: {count}")

        relationship_counts = self.graph.run("MATCH ()-[r]->() RETURN DISTINCT type(r) AS type, count(*) AS count").data()
        print("\nrelation:")
        for result in relationship_counts:
            relationship_type = result['type']
            count = result['count']
            print(f"{relationship_type}: {count}")

p = NeoDB()
p.query_init()