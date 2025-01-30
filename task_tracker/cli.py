import sys
import tareas
from datetime import datetime
if __name__ == '__main__':
    if len(sys.argv)==2:
        if sys.argv[1]=='list':
            datos = tareas.leer_json()
            for dato in datos:
                print(f"\ntarea: {dato['id']}, descripcion: {dato['descripcion']}, estatus: {dato['estatus']}, fecha de creacion: {dato['fecha_creacion']}, fecha de actualizacion: {dato['fecha_actualizacion']}\n")
        elif sys.argv[1]=='add':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='delete':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='update':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        

    elif len(sys.argv)==3:
        if sys.argv[1]=='add':
            datos = tareas.leer_json()
            if len(datos)==0:
                identificador=0
            if len(datos)!=0:
                for dato in datos:
                    identificador = dato['id'] 
            tarea = tareas.Tareas(identificador+1,sys.argv[2])
            nueva_tarea={
                'id': tarea.id,
                'descripcion':tarea.descripcion,
                'estatus':tarea.estatus,
                'fecha_creacion':tarea.fecha_creacion,
                'fecha_actualizacion':tarea.fecha_actualizacion
            }
            print(f"tarea agregada exitosamente! (ID: {identificador+1})")
            datos.append(nueva_tarea)
            tareas.escribir_json(datos)
        
        elif sys.argv[1]=='delete':
            tarea_encontrada=None
            datos = tareas.leer_json()
            for dato in datos:
                if str(dato['id']) == sys.argv[2]:
                    tarea_encontrada=dato
            if tarea_encontrada is None:
                print("tarea no encontrada")
            else:
                print(f"tarea con id: '{tarea_encontrada['id']}' eliminada exitosamete!")
                datos.remove(tarea_encontrada)
                tareas.escribir_json(datos)

        else:
            print(f"error: el comando '{sys.argv[1]}' es desconocido")
    
    elif len(sys.argv)==4:
        if sys.argv[1]=='update':
            datos = tareas.leer_json()
            for dato in datos:
                if str(dato['id']) == sys.argv[2]:
                    print(f"tarea con id: '{dato['id']}' y descripcion: '{dato['descripcion']}' actualizada correctamente!")
                    dato['descripcion']=sys.argv[3]
                    dato['fecha_actualizacion']=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    break
            tareas.escribir_json(datos)
            
            


    
        

            

    