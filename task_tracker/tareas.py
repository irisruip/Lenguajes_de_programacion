from datetime import datetime
import os
import json

class Tareas:
    def __init__(self, id, descripcion):
        self.id= id
        self.descripcion = descripcion
        self.estatus = 'pendiente'
        self.fecha_creacion = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.fecha_actualizacion = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def leer_json():
    if not os.path.isfile('tareas.json'):
        with open('tareas.json', 'w') as f:
            json.dump([], f)
    with open ('tareas.json', 'r') as f:
        tareas=json.load(f)
    return tareas

def escribir_json(tareas):
    with open('tareas.json','w') as f:
        json.dump(tareas,f)
    



    

        
