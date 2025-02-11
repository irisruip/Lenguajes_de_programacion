import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget
from PyQt5.QtGui import QPixmap, QPalette, QBrush
from PyQt5.QtCore import Qt

from main import PokedexApp  # Asegúrate de importar la clase PokedexApp

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        
        # Configurar la ventana principal
        self.setWindowTitle('Ventana Principal')
        self.setGeometry(100, 100, 800, 800)
        
        # Crear un widget central y establecer un diseño
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        
        # Crear el botón "Ir al Pokedex" con estilo mejorado
        self.pokedex_button = QPushButton('Ir al Pokedex', self)
        self.pokedex_button.clicked.connect(self.go_to_pokedex)
        self.style_button(self.pokedex_button)
        layout.addWidget(self.pokedex_button)
        
        # Centrar el botón dentro del layout
        layout.setAlignment(self.pokedex_button, Qt.AlignCenter)

        # Establecer el fondo de la ventana con la imagen en la carpeta 'imagen'
        self.set_background_image('imagen/pokemon.jpg')  # Especifica la ruta correcta
        
        # Centrar la ventana en la pantalla
        self.center_window()

    def center_window(self):
        """Centrar la ventana en la pantalla"""
        screen = QApplication.primaryScreen()
        rect = screen.availableGeometry()
        self.move((rect.width() - self.width()) // 2, (rect.height() - self.height()) // 2)

    def set_background_image(self, image_path):
        """Establecer una imagen como fondo"""
        pixmap = QPixmap(image_path)
        palette = QPalette()
        palette.setBrush(QPalette.Background, QBrush(pixmap))
        self.setPalette(palette)

    def go_to_pokedex(self):
        """Abrir la ventana del Pokedex"""
        self.pokedex_window = PokedexApp()  # Crear una instancia de la clase PokedexApp
        self.pokedex_window.show()  # Mostrar la ventana del Pokedex
        self.close()  # Cerrar la ventana principal

    def style_button(self, button):
        """Estilo para el botón"""
        button.setStyleSheet("""
            QPushButton {
                background-color: #ff9800;  /* Color de fondo (naranja) */
                color: white;                /* Color de texto (blanco) */
                font-size: 16px;             /* Tamaño de la fuente */
                font-weight: bold;          /* Negrita */
                border-radius: 15px;        /* Bordes redondeados */
                padding: 10px 15px;         /* Ajustar el padding para que no sea tan ancho */
                border: none;               /* Sin borde */
                max-width: 200px;           /* Establecer un ancho máximo para el botón */
            }
            QPushButton:hover {
                background-color: #e68900; /* Cambio de color al pasar el mouse */
            }
            QPushButton:pressed {
                background-color: #d57d00; /* Color cuando el botón es presionado */
            }
        """)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

