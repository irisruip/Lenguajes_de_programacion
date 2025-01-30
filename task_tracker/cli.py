import sys
import tareas
from datetime import datetime
print("--lista de comandos--\n")
print(f"- add: añadir tarea\n- update: actualizar la descripcion de una tarea\n- delete: eliminar tarea\n- list: listar todas las tareas")
print(f"- mark-done: actualiza una tarea como completada\n- mark-in-progress: actualiza una tarea como en progreso")
print(f"- list done: muestra las tareas completadas\n- list todo: muestra las tareas pendiente\n- list in-progress: muestra las tareas en progreso\n")
if __name__ == '__main__':
    if len(sys.argv)==2:
        if sys.argv[1]=='list':
            tareas.listar()
        elif sys.argv[1]=='add':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='delete':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='update':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='mark-done':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        elif sys.argv[1]=='mark-in-progress':
            print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        

    elif len(sys.argv)==3:
        if sys.argv[1]=='add':
            tareas.add()
        
        elif sys.argv[1]=='delete':
            tareas.delete()
        
        elif sys.argv[1]=='mark-done':
            tareas.update_status("completada")

        elif sys.argv[1]=='mark-in-progress':
            tareas.update_status("en progreso")

        elif sys.argv[1]=='list':
            if sys.argv[2]=='done':
                tareas.listar_completadas()
            elif sys.argv[2]=='in-progress':
                tareas.listar_en_progreso()
            elif  sys.argv[2]=='todo':
                tareas.listar_pendientes()
            else:
                print(f"el comando '{sys.argv[1]}' necesita un argumento valido")
        else:
            print(f"error: el comando '{sys.argv[1]}' es desconocido")
    
    elif len(sys.argv)==4:
        tareas.update()
    
    else:
        print("error: demasiados argumentos")
            
            


    
        

            

    