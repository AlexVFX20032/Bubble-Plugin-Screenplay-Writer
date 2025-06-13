function(instance, context) {
    // Crea el contenedor para el editor
    var container = $('<div class="editor-container"></div>');
    var editorHTML = '<div id="editorjs"></div>';
    container.html(editorHTML);
    instance.canvas.append(container);

    window.addEventListener('keydown', (ev) => {
        if(ev.key === 'Tab') {
            const popoverElement = document.querySelector('.ce-popover');
            if (popoverElement && !popoverElement.classList.contains('ce-popover--opened')) {
            	ev.preventDefault();
            	document.getElementsByClassName('ce-toolbar__plus')[0].click();
            }
        }
    })
}