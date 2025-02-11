import sys
import requests
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QPixmap
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from vista.pokedex import Ui_home  # Asegúrate de que esta importación sea válida

class PokedexApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.ui = Ui_home()
        self.ui.setupUi(self)
        
        # Inicialización de variables
        self.pokemon_index = 1  # Pokémon inicial (Bulbasaur)
        self.load_pokemon(self.pokemon_index)
        
        # Conectar botones a las funciones
        self.ui.prevButton.clicked.connect(self.show_previous_pokemon)
        self.ui.nextButton.clicked.connect(self.show_next_pokemon)
        
        # Configurar el reproductor de música
        self.player = QMediaPlayer()
        self.setup_music()

    def setup_music(self):
        """Configurar y reproducir la música de Pokémon"""
        music_url = QUrl.fromLocalFile('musica/pokemon-intro.mp3')  # Ruta al archivo de música de Pokémon en la carpeta 'musica'
        content = QMediaContent(music_url)
        self.player.setMedia(content)
        self.player.setVolume(50)  # Ajustar volumen si es necesario
        self.player.play()  # Reproducir la música al iniciar la app
    
    def load_pokemon(self, pokemon_id):
        """Cargar un Pokémon desde la API y actualizar la interfaz"""
        url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_id}/'
        response = requests.get(url)
        
        if response.status_code == 200:
            pokemon_data = response.json()
            
            # Obtener nombre y convertir a mayúsculas
            name = pokemon_data['name'].capitalize()
            abilities = ', '.join([ability['ability']['name'] for ability in pokemon_data['abilities']])
            height = pokemon_data['height'] / 10  # altura en metros
            # URL de la imagen
            image_url = pokemon_data['sprites']['front_default']
            
            # Actualizar UI
            self.ui.nameLabel.setText(f"Nombre: {name}")
            self.ui.abilitiesLabel.setText(f"Habilidades: {abilities}")
            self.ui.heightLabel.setText(f"Altura: {height}m")
            
            # Cargar la imagen del Pokémon
            pixmap = QPixmap()
            pixmap.loadFromData(requests.get(image_url).content)
            self.ui.pokemonImage.setPixmap(pixmap)
            
            # Limpiar las habilidades adicionales si no existen
            if len(pokemon_data['abilities']) > 1:
                self.ui.ability1Label.setText(f"Primera habilidad: {pokemon_data['abilities'][0]['ability']['name']}")
                self.ui.ability2Label.setText(f"Segunda habilidad: {pokemon_data['abilities'][1]['ability']['name']}")
            else:
                self.ui.ability1Label.setText("")
                self.ui.ability2Label.setText("")
        else:
            print(f"Error: {response.status_code}")
    
    def show_previous_pokemon(self):
        """Mostrar el Pokémon anterior"""
        if self.pokemon_index > 1:
            self.pokemon_index -= 1
            self.load_pokemon(self.pokemon_index)
    
    def show_next_pokemon(self):
        """Mostrar el siguiente Pokémon"""
        self.pokemon_index += 1
        self.load_pokemon(self.pokemon_index)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = PokedexApp()
    window.show()
    sys.exit(app.exec_())
