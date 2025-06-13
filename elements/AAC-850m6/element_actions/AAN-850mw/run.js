function(instance, properties, context) {
    function generateRandom8DigitString() {
        let randomNumber = Math.floor(Math.random() * 100000000);
        let randomString = randomNumber.toString().padStart(8, '0');
        return randomString;
    }

    this.current_user_uuid = generateRandom8DigitString();
    console.log("HELLO IM " + this.current_user_uuid);
    console.log("-----------------------------Editor", this.editor);
    this.blocks_data = {};
    this.isHandlingRemoteEvent = false;
    this.remoteBlockIds = new Set();

    // Ensure remote cursor styles are added only once
    if (!document.getElementById('remote-cursor-style')) {
        const style = document.createElement('style');
        style.id = 'remote-cursor-style';
        style.textContent = `
            .remote-cursor {
                position: absolute;
                width: 2px;
                background: red;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }

    const createWebSocket = () => {
        const socket = new WebSocket('wss://free.blr2.piesocket.com/v3/1?api_key=4yn77E9zUO31vzW9fSgn6y66C96vpaZRYPJXO72l&notify_self=1');

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        socket.onmessage = async (event) => {
            try {
                const current_guion_id = window.location.pathname.split("/")[3]
                const [uuid, guion_id, socket_data] = JSON.parse(event.data);

                if(guion_id !== current_guion_id) return
                if (uuid === this.current_user_uuid) return;

                console.log("onmessage", [uuid, socket_data]);
                const { action, data } = socket_data;

                const { block_id, block_data, block_position, block_type } = data;

                console.log("action: ", action);
                switch (action) {
                    case "update":
                        this.isHandlingRemoteEvent = true;
                        await this.editor.blocks.update(block_id, {
                            text: block_data
                        }, {test: 1} )
                        setTimeout(() => {
                            this.isHandlingRemoteEvent = false
                        }, 500)
                        break;
                    case "delete":
                        this.isHandlingRemoteEvent = true;
                        const position = block_id ? await this.editor.blocks.getBlockIndex(block_id) : block_position
                        await this.editor.blocks.delete(position)
                        setTimeout(() => {
                            this.isHandlingRemoteEvent = false
                        }, 500)
                        break;
                    case "create":
                        this.isHandlingRemoteEvent = true;
                        this.remoteBlockIds.add(block_id);
                        await this.editor.blocks.insert(
                            block_type, 
                            { text: block_data, customAttribute: "test" }, 
                            {}, 
                            block_position, 
                            true,
                            false,
                            block_id
                        );
                        this.isHandlingRemoteEvent = false;
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.error('Error parsing WebSocket message: ', e, event.data);
                this.isHandlingRemoteEvent = false; // Asegurar que la bandera se desactive en caso de error
            }
        };

        socket.onclose = () => {
            console.log('WebSocket closed, attempting to reconnect...');
            setTimeout(createWebSocket, 1000); // Intentar reconectar después de 1 segundo
        };

        return socket;
    };

    const socket = createWebSocket();

    const handleEventEditor = (event) => {
        console.log("EVENT--", event);
        if (this.isHandlingRemoteEvent) {
            return;
        }

        if (!event || !event.detail) {
            console.warn("Invalid event structure", event);
            return;
        }

        const event_index = event.detail.index;
        const block = this.editor.blocks.getBlockByIndex(event_index);

        if (!block) {
            console.warn("Block not found at index", event_index);
            // return;
        }

        const block_id = block?.id;
        const block_data = block?.holder.innerText;
        const block_position = event.detail.index;
        const block_type = block?.name;

        console.log(block, block_id)

        if (this.remoteBlockIds.has(block_id)) {
            this.remoteBlockIds.delete(block_id); // Remover el bloque de la lista de bloques remotos procesados
            return; // Ignorar eventos generados por bloques insertados remotamente
        }

        let data = {};
        let action;

        console.log("Event type: ", event.type);
        switch (event.type) {
            case "block-added":
                action = "create";
                data.block_id = block_id;
                data.block_data = block_data;
                data.block_position = block_position;
                data.block_type = block_type;
                break;
            case "block-removed":
                action = "delete";
                // data.block_id = block_id;
                data.block_position = block_position;
                break;
            case "block-changed":
                action = "update";
                data.block_id = block_id;
                data.block_data = block_data;
                data.block_type = block_type;
                break;   
            default:
                break;
        }

        const socket_data = {
            action,
            data
        };

        const guion_id = window.location.pathname.split("/")[3]

        const my_socket_data = JSON.stringify([this.current_user_uuid, guion_id , socket_data]);

        socket.send(my_socket_data);

        // if(this.isTimeToSave || this.isTimeToSave === undefined) {
        //     gg()
        //     this.isTimeToSave = false
        //     setTimeout(() => {
        //         this.isTimeToSave = true
        //     }, 5 * 60 * 1000)
        // }

        console.log("Data sent to websocket", my_socket_data);
    } 

    this.editor.configuration.onChange = (api, event) => {
        if(Array.isArray(event)) {
            event.map(e => handleEventEditor(e))
        }else {
            handleEventEditor(event)
        }

    };

    // Add listener for Enter key to detect block creation
    // document.addEventListener('keydown', (event) => {
    //     if (event.key === 'Enter') {
    //         setTimeout(() => {
    //             const blocksCount = this.editor.blocks.getBlocksCount();
    //             const newBlock = this.editor.blocks.getBlockByIndex(blocksCount - 1);
    //             const newBlockId = newBlock.id;
    //             const newBlockData = newBlock.holder.innerText;
    //             const prevBlock = this.editor.blocks.getBlockByIndex(blocksCount - 2);

    //             const prev_block_id = prevBlock ? prevBlock.id : null;
    //             const next_block_id = null; // New block is always at the end, so no next block

    //             const socket_data = {
    //                 action: 'create',
    //                 data: {
    //                     block_id: newBlockId,
    //                     block_data: newBlockData,
    //                     prev_block_id,
    //                     next_block_id
    //                 }
    //             };

    //             const my_socket_data = JSON.stringify([this.current_user_uuid, socket_data]);
    //             socket.send(my_socket_data);
    //             console.log("Data sent to websocket (Enter key pressed)", my_socket_data);
    //         }, 100); // Delay to ensure the block is created
    //     }
    // });
}
