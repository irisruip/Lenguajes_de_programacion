from datetime import datetime
import os
import json
import sys
class Tareas:
    def __init__(self, id, descripcion):
        self.id= id
        self.descripcion = descripcion
        self.estatus = 'pendiente'
        self.fecha_creacion = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.fecha_actualizacion = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def listar():
    datos = leer_json()
    for dato in datos:
        print(f"\ntarea: {dato['id']}, descripcion: {dato['descripcion']}, estatus: {dato['estatus']}, fecha de creacion: {dato['fecha_creacion']}, fecha de actualizacion: {dato['fecha_actualizacion']}\n")

def listar_completadas():
    datos = leer_json()
    lista_tareas=[]
    for dato in datos:
        if dato['estatus']=='completada':
            lista_tareas.append(dato)
    if len(lista_tareas)==0:
        print("no hay tareas completadas")
    else:
        for dato in lista_tareas:
            print(f"\ntarea: {dato['id']}, descripcion: {dato['descripcion']}, estatus: {dato['estatus']}, fecha de creacion: {dato['fecha_creacion']}, fecha de actualizacion: {dato['fecha_actualizacion']}\n")

def listar_en_progreso():
    datos = leer_json()
    lista_tareas=[]
    for dato in datos:
        if dato['estatus']=='en progreso':
            lista_tareas.append(dato)
    if len(lista_tareas)==0:
        print("no hay tareas en progreso")
    else:
        for dato in lista_tareas:
            print(f"\ntarea: {dato['id']}, descripcion: {dato['descripcion']}, estatus: {dato['estatus']}, fecha de creacion: {dato['fecha_creacion']}, fecha de actualizacion: {dato['fecha_actualizacion']}\n")

def listar_pendientes():
    datos = leer_json()
    lista_tareas=[]
    for dato in datos:
        if dato['estatus']=='pendiente':
            lista_tareas.append(dato)
    if len(lista_tareas)==0:
        print("no hay tareas pendientes")
    else:
        for dato in lista_tareas:
            print("--tareas pendientes--")
            print(f"\ntarea: {dato['id']}, descripcion: {dato['descripcion']}, estatus: {dato['estatus']}, fecha de creacion: {dato['fecha_creacion']}, fecha de actualizacion: {dato['fecha_actualizacion']}\n")

def add():
    datos = leer_json()
    if len(datos)==0:
        identificador=0
    if len(datos)!=0:
        for dato in datos:
            identificador = dato['id'] 
    tarea = Tareas(identificador+1,sys.argv[2])
    nueva_tarea={
                'id': tarea.id,
                'descripcion':tarea.descripcion,
                'estatus':tarea.estatus,
                'fecha_creacion':tarea.fecha_creacion,
                'fecha_actualizacion':tarea.fecha_actualizacion
            }
    print(f"tarea agregada exitosamente! (ID: {identificador+1})")
    datos.append(nueva_tarea)
    escribir_json(datos)

def delete():
    tarea_encontrada=None
    datos = leer_json()
    for dato in datos:
        if str(dato['id']) == sys.argv[2]:
            tarea_encontrada=dato
    if tarea_encontrada is None:
        print("tarea no encontrada")
    else:
        print(f"tarea con id: '{tarea_encontrada['id']}' eliminada exitosamete!")
        datos.remove(tarea_encontrada)
        escribir_json(datos)

def update():
    if sys.argv[1]=='update':
        datos = leer_json()
        bandera=0
        for dato in datos:
            if str(dato['id']) == sys.argv[2]:
                print(f"tarea con id: '{dato['id']}' y descripcion: '{dato['descripcion']}' actualizada correctamente!")
                dato['descripcion']=sys.argv[3]
                dato['fecha_actualizacion']=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                bandera=1
                break
        if bandera==0:
            print("no se encontro la tarea que se quiere actualizar")
        escribir_json(datos)

def update_status(estatus):
    datos = leer_json()
    for dato in datos:
        if str(dato['id']) == sys.argv[2]:
            print(f"tarea con id: '{dato['id']}' y estatus: '{dato['estatus']}' actualizada correctamente!")
            dato['estatus']=estatus
            dato['fecha_actualizacion']=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            break
    escribir_json(datos)

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

    



    

        
