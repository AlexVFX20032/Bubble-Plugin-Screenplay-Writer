function(instance, properties, context) {
    const editor = this.editor;
    editor.save().then((outputData) => {
        const blocks = outputData.blocks
        instance.publishState('contenido', JSON.stringify(blocks))
        console.log(blocks)
        document.getElementById('save_bbdd_button').click()
    })
}
