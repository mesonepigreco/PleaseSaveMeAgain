export class Keyboard {
    constructor() {
        this.keys = {
        };

        this.firefunctions = [];

        let self = this;
        document.addEventListener("keydown", (event) => {
            self.keys[event.key] = true;

            if (event.target == document.body) 
                event.preventDefault();
        });
        document.addEventListener("keyup", (event) => {
            self.keys[event.key] = false;

            for (let i = 0; i < this.firefunctions.length; ++i) {
                if (event.key === this.firefunctions[i].key) 
                    this.firefunctions[i].func();
            }
        });
    }
}