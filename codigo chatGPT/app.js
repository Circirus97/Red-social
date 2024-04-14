let carouselIndex = 0;
const cards = document.querySelectorAll('.carousel .card');

function showCard(index) {
    cards.forEach(card => card.style.display = 'none');
    cards[index].style.display = 'block';
}

function nextCard() {
    carouselIndex++;
    if (carouselIndex >= cards.length) {
        carouselIndex = 0;
    }
    showCard(carouselIndex);
}

function startCarousel() {
    setInterval(nextCard, 3000); // Cambia de tarjeta cada 3 segundos
}

showCard(carouselIndex); // Mostrar la primera tarjeta al cargar la página
startCarousel(); // Iniciar el carrusel automáticamente
