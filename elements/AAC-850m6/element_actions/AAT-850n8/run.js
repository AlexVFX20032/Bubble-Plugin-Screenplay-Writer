function(instance, properties, context) {

    // Obtener contenido actual del editor
    const editorContent = document.getElementById("editorjs").innerHTML;

    // Abrir nueva ventana flotante para impresión
    const printWindow = window.open('', '_blank', 'height=600,width=800');

    // Escribir el contenido del editor en la nueva ventana
    printWindow.document.write('<html><head><title>Imprimir</title>');

    // Agregar el enlace a la fuente 'Courier Prime'
    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap" rel="stylesheet">');

    // Copiar estilos actuales
    Array.from(document.styleSheets).forEach(styleSheet => {
        if (styleSheet.href) {
            printWindow.document.write('<link rel="stylesheet" type="text/css" href="' + styleSheet.href + '">');
        } else {
            printWindow.document.write('<style>' + Array.from(styleSheet.cssRules).map(rule => rule.cssText).join(' ') + '</style>');
        }
    });

    // Agregar estilos de impresión con los márgenes específicos y ocultar la toolbar
    printWindow.document.write(`
        <style>
            body {
                font-family: 'Courier Prime', monospace;
                
                margin: 0; /* Eliminar márgenes por defecto */
                padding-left: 60px; /* Margen izquierdo */
                padding-right: 39px; /* Margen derecho */
                padding-top: 97px; /* Margen superior */
                padding-bottom: 97px; /* Margen inferior */
                width: 100%;
                min-height: 100%; /* Asegura que el contenido ocupe toda la altura */
                position: relative;
                overflow: hidden; /* Permitir que el contenedor crezca dinámicamente */
                margin-right: -23px; /* Ajuste del margen derecho */
            }
            .ce-toolbar__actions {
                display: none; /* Ocultar la barra de herramientas */
            }
            @media print {
                body {
					font-smoothing: antialiased;
      				-webkit-font-smoothing: antialiased;
       				
                    font-family: 'Courier Prime', monospace;
                    font-weight: 100;
                    margin: 0; /* Eliminar márgenes por defecto */
                    padding-left: 55px; /* Margen izquierdo */
                    padding-right: 55px; /* Margen derecho */
                    padding-top: 110px; /* Margen superior */
                    padding-bottom: 97px; /* Margen inferior */
                    width: 100%;
                    min-height: 100%; /* Asegura que el contenido ocupe toda la altura */
                    position: relative;
                    overflow: hidden; /* Permitir que el contenedor crezca dinámicamente */
                    margin-right: -23px; /* Ajuste del margen derecho */
                }
                .ce-toolbar__actions {
                    display: none !important; /* Ocultar la barra de herramientas */
                }
            }
        </style>
    `);

    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap" rel="stylesheet">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(editorContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Imprimir y cerrar la ventana después de la impresión
    printWindow.print();
    printWindow.onafterprint = function() {
        printWindow.close();
    };
}