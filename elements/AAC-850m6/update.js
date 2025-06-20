function(instance, properties, context) {   
    if(!this.firstLoad) {
        this.firstLoad = true
    	const initial_content = JSON.parse(properties.initial_content)
        
        // Aquí podrías inicializar cualquier script JavaScript necesario
        class PersonajeBlock {
            constructor({ data }) {
                this.data = data || { text: "Nombre del personaje" };
            }

            static get toolbox() {
                return {
                    icon: '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path></svg>',
                    title: 'Personaje'
                };
            }

            static get enableLineBreaks() {
                return false;
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.classList.add('custom-block');
                wrapper.innerHTML = `<div contenteditable="true" style="text-transform: uppercase;">${this.data.text || ''}</div>`;
                return wrapper;
            }

            save(blockContent) {
                return {
                    text: blockContent.querySelector('div').innerText
                };
            }
        }

        class DialogBlock {
            constructor({ data }) {
                this.data = data || { text: "Texto del diálogo" };
            }

            static get toolbox() {
                return {
                    icon: '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M14.999,8.543c0,0.229-0.188,0.417-0.416,0.417H5.417C5.187,8.959,5,8.772,5,8.543s0.188-0.417,0.417-0.417h9.167C14.812,8.126,14.999,8.314,14.999,8.543 M12.037,10.213H5.417C5.187,10.213,5,10.4,5,10.63c0,0.229,0.188,0.416,0.417,0.416h6.621c0.229,0,0.416-0.188,0.416-0.416C12.453,10.4,12.266,10.213,12.037,10.213 M14.583,6.046H5.417C5.187,6.046,5,6.233,5,6.463c0,0.229,0.188,0.417,0.417,0.417h9.167c0.229,0,0.416-0.188,0.416-0.417C14.999,6.233,14.812,6.046,14.583,6.046 M17.916,3.542v10c0,0.229-0.188,0.417-0.417,0.417H9.373l-2.829,2.796c-0.117,0.116-0.71,0.297-0.71-0.296v-2.5H2.5c-0.229,0-0.417-0.188-0.417-0.417v-10c0-0.229,0.188-0.417,0.417-0.417h15C17.729,3.126,17.916,3.313,17.916,3.542 M17.083,3.959H2.917v9.167H6.25c0.229,0,0.417,0.187,0.417,0.416v1.919l2.242-2.215c0.079-0.077,0.184-0.12,0.294-0.12h7.881V3.959z"></path></svg>',
                    title: 'Diálogo'
                };
            }

            static get enableLineBreaks() {
                return false;
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.classList.add('dialog-block');
                wrapper.innerHTML = `<div contenteditable="true">${this.data.text || ''}</div>`;
                return wrapper;
            }

            save(blockContent) {
                return {
                    text: blockContent.querySelector('div').innerText
                };
            }
        }

        class ParenthesisBlock {
            constructor({ data }) {
                this.data = data || { text: "Texto entre paréntesis" };
            }

            static get toolbox() {
                return {
                    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 4C14 4 11 5 11 9C11 13 11 15 11 18C11 21 6 23 6 23C6 23 11 25 11 28C11 31 11 35 11 39C11 43 14 44 16 44" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M32 4C34 4 37 5 37 9C37 13 37 15 37 18C37 21 42 23 42 23C42 23 37 25 37 28C37 31 37 35 37 39C37 43 34 44 32 44" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    title: 'Paréntesis'
                };
            }

            static get enableLineBreaks() {
                return false;
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.classList.add('parenthesis-block');
                wrapper.innerHTML = `
    <div class="parenthesis-content">
    <div class="parenthesis-open">(</div>
    <div class="parenthesis-text" contenteditable="true">${this.data.text || ''}</div>
    <div class="parenthesis-close">)</div>
    </div>`;
                const parenthesisContent = wrapper.querySelector('.parenthesis-content');
                parenthesisContent.style.width = 'fit-content';

                return wrapper;
            }

            save(blockContent) {
                return {
                    text: blockContent.querySelector('.parenthesis-text').innerText
                };
            }
        }

        class SceneBlock {
            constructor({ data }) {
                this.data = data || { text: "Texto de la escena" };
            }

            static get toolbox() {
                return {
                    icon: '<svg class="svg-icon" viewBox="0 0 20 20"> <path d="M18.555,15.354V4.592c0-0.248-0.202-0.451-0.45-0.451H1.888c-0.248,0-0.451,0.203-0.451,0.451v10.808c0,0.559,0.751,0.451,0.451,0.451h16.217h0.005C18.793,15.851,18.478,14.814,18.555,15.354 M2.8,14.949l4.944-6.464l4.144,5.419c0.003,0.003,0.003,0.003,0.003,0.005l0.797,1.04H2.8z M13.822,14.949l-1.006-1.317l1.689-2.218l2.688,3.535H13.822z M17.654,14.064l-2.791-3.666c-0.181-0.237-0.535-0.237-0.716,0l-1.899,2.493l-4.146-5.42c-0.18-0.237-0.536-0.237-0.716,0l-5.047,6.598V5.042h15.316V14.064z M12.474,6.393c-0.869,0-1.577,0.707-1.577,1.576s0.708,1.576,1.577,1.576s1.577-0.707,1.577-1.576S13.343,6.393,12.474,6.393 M12.474,8.645c-0.371,0-0.676-0.304-0.676-0.676s0.305-0.676,0.676-0.676c0.372,0,0.676,0.304,0.676,0.676S12.846,8.645,12.474,8.645"></path></svg>',
                    title: 'Escena'
                };
            }

            static get enableLineBreaks() {
                return false;
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.classList.add('scene-block');
                wrapper.innerHTML = `<div contenteditable="true">${this.data.text || ''}</div>`;

                return wrapper;
            }

            save(blockContent) {
                return {
                    text: blockContent.querySelector('div').innerText
                };
            }
        }

        class TransitionBlock {
            constructor({ data }) {
                this.data = data || { text: "Texto de la transicion" };
            }

            static get toolbox() {
                return {
                    icon: '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z"></path></svg>',
                    title: 'Transición'
                };
            }

            static get enableLineBreaks() {
                return false;
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.classList.add('transition-block');
                wrapper.innerHTML = `<div contenteditable="true">${this.data.text || ''}</div>`
                
                return wrapper;
            }

            save(blockContent) {
                return {
                    text: blockContent.querySelector('div').innerText
                };
            }
        }

        const editor = new EditorJS({
            holderId: 'editorjs',
            autofocus: true,
            tools: {
            
                scene: {
                    class: SceneBlock
                },
                personaje: {
                    class: PersonajeBlock
                },
                parenthesis: {
                    class: ParenthesisBlock
                },
                dialog: {
                    class: DialogBlock
                },
                transition: {
                    class: TransitionBlock
                },
            },

            data: {
                blocks: initial_content ?? [
                    {
                        type: "paragraph",
                        data: {
                            text: ''
                        }
                    }
                ]
            }

        });
        

        this.editor = editor
    }
}