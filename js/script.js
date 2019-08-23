class Clientes {
    constructor() {
        this.listaClientes = localStorage.getItem('clientes') || []
        this.clienteSafe;
        this.table = document.querySelector('.container')
        this.edit = [false, 0]
        if (typeof this.listaClientes == 'string') {
            this.listaClientes = JSON.parse(this.listaClientes)
            this.updateTable()
        }
    }

    nuevoCliente(cliente) {
        if (!this.edit[0]) {
            this.listaClientes.push(cliente)
        } else {
            this.listaClientes[this.edit[1]] = cliente
        }
        this.updateTable()
        return true
    }

    updateTable() {
        localStorage.setItem('clientes', JSON.stringify(this.listaClientes))
        if (!this.edit[0]) {
            this.table.innerHTML = ""
            for (let i = 0; i < this.listaClientes.length; i++) {
                let telefonos = '',
                    tr = document.createElement('tr')
                tr.id = `tblrw${i}`
                for (let j = 0; j < this.listaClientes[i].telefonos.length; j++) {
                    telefonos += `
                        <li>${this.listaClientes[i].telefonos[j].numero} (${this.listaClientes[i].telefonos[j].tipo})</li>`
                }
                tr.innerHTML += `
                       <td>${this.listaClientes[i].nombre}</td>
                       <td>${this.listaClientes[i].apellido}</td>
                       <td>${this.listaClientes[i].dni}</td>
                       <td><ul>${telefonos}</ul></td>
                       <td class="config-td">
                            <button type="button" class="icon icon-pencil"></button>
                            <button type="button" class="icon icon-delete"></button>
                       </td>`
                this.table.appendChild(tr)
            }
        } else {
            let telefonos = ''
            for (let j = 0; j < this.listaClientes[this.edit[1]].telefonos.length; j++) {
                telefonos += `
                    <li>${this.listaClientes[this.edit[1]].telefonos[j].numero} (${this.listaClientes[this.edit[1]].telefonos[j].tipo})</li>`
            }
            this.table.children[this.edit[1]].innerHTML = `
                   <td>${this.listaClientes[this.edit[1]].nombre}</td>
                   <td>${this.listaClientes[this.edit[1]].apellido}</td>
                   <td>${this.listaClientes[this.edit[1]].dni}</td>
                   <td><ul>${telefonos}</ul></td>
                   <td class="config-td">
                        <button type="button" class="icon icon-pencil"></button>
                        <button type="button" class="icon icon-delete"></button>
                   </td>`
            this.edit = [false, -1]
        }
        this.deleteEditClass()
        let habilitar = this.table.querySelectorAll('.icon')
        for (let i = 0; i < habilitar.length; i++) {
            habilitar[i].removeAttribute('disabled')
        }
    }
    editRow(element) {
        let tableRows = [...element.parentElement.querySelectorAll('tr')],
            index = tableRows.indexOf(element)
        this.deleteEditClass()
        this.edit = [true, index]
        this.table.children[index].classList.add('row-edit')
        return index
    }
    deletedRow(element) {
        let tableRows = [...element.parentElement.querySelectorAll('tr')],
            index = tableRows.indexOf(element)
        this.listaClientes.splice(index, 1)
        this.deleteEditClass()
        this.updateTable()
    }
    deleteEditClass() {
        let deletedClass = this.table.querySelector('.row-edit')
        if (deletedClass) {
            deletedClass.classList.remove('row-edit')
        }
    }
}
class FormCliente {
    constructor(form) {
        this.form = form
        this.cantidadTelefonos = 1
        this.formTitle = this.form.querySelector('.form-title')
        this.alert = this.form.querySelector('.invality')
        this.cancelarBtn = this.form.querySelector('.btn-cancelar')
        this.enviarBtn = this.form
            .querySelector(".btn-submit")
        this.agregarTelefonoBtn = this.form
            .querySelector(".btn-agregartelefono")
        this.quitarTelefonoBtn = this.form
            .querySelector(".btn-quitartelefono")
        this.telefonos = this.form
            .querySelector(".telefonos-container")
        this.eventBlur()
    }

    creandoCliente(evt) {
        let input = evt.target,
            inputTelefonos = this.telefonos.querySelectorAll('input'),
            telefonos = []
        for (let i = 0; i < inputTelefonos.length; i++) {
            if (i % 2 === 0) {
                telefonos.push({
                    numero: inputTelefonos[i].value,
                    tipo: inputTelefonos[i + 1].value || 'Sin especificar'
                })
            }
        }
        return {
            nombre: input[0].value,
            apellido: input[1].value,
            dni: input[2].value,
            telefonos: telefonos
        }
    }

    validar(target) {
        if (target.checkValidity()) {
            target.classList.remove('invality-input')
            target.classList.add('vality-input')
            target.nextElementSibling.classList.add("input-full")
        } else {
            target.nextElementSibling.classList.remove("input-full")
            target.classList.remove('vality-input')
            target.classList.add('invality-input')
            if(target.validity.badInput) {
                    target.nextElementSibling.classList.add("input-full")
                }
                else{
                    target.nextElementSibling.classList.remove("input-full")
                }
        }
        this.showAlert()
    }

    agregarTelefono() {
        let nuevoTelefono = document
            .createElement("div")
        nuevoTelefono.classList.add("form-control")
        nuevoTelefono.innerHTML = `  
        <div class="form-subcontrol">
          <input class="input-form" type="tel" id="ctn${this.cantidadTelefonos}" required>
          <label class="label-input" for="ctn${this.cantidadTelefonos}">* Telefono</label>
        </div>
        <div class="form-subcontrol">
          <input class="input-form" type="text" id="ctt${this.cantidadTelefonos}">
          <label class="label-input" for="ctt${this.cantidadTelefonos}">Tipo</label>
        </div>`
        this.telefonos.appendChild(nuevoTelefono)
        let inputFocus = this.telefonos.querySelector(`#ctn${this.cantidadTelefonos}`)
        inputFocus.focus()
            ++this.cantidadTelefonos
        this.eventBlur()
        if (this.cantidadTelefonos > 1) {
            this.quitarTelefonoBtn
                .removeAttribute('disabled')
        }
        if (this.cantidadTelefonos == 5) {
            this.agregarTelefonoBtn
                .setAttribute('disabled', '')
        }
    }


    quitarTelefono() {
        --this.cantidadTelefonos
        this.telefonos.lastChild.remove()
        if (this.cantidadTelefonos === 1) {
            this.quitarTelefonoBtn
                .setAttribute('disabled', '')
        }
        if (this.cantidadTelefonos < 5) {
            this.agregarTelefonoBtn
                .removeAttribute('disabled')
        }
        this.showAlert()
    }

    showAlert() {
        let show = [...this.form].find((valor) => {
            if (valor.hasAttribute('required')) {
                return valor.classList[1] === 'invality-input'
            }
        })
        if (show) {
            this.alert.classList.add('show-alert')
        } else {
            this.alert.classList.remove('show-alert')
        }
        return show
    }
    eventBlur() {
        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].tagName === 'INPUT') {
                this.form[i].onblur = (evt) => {
                    this.validar(evt.target)
                }
            }
        }
    }

    editCliente(cliente) {
        let telefonos = cliente.telefonos
        this.form[0].value = cliente.nombre
        this.form[1].value = cliente.apellido
        this.form[2].value = cliente.dni
        this.form[3].value = cliente.telefonos[0].numero
        console.log(this.form[4].value)
        this.form[4].value = (telefonos[0].tipo == 'Sin especificar')? '' : telefonos[0].tipo
        console.log(this.form[4].value)
        let indice = this.telefonos.children.length - 1
        for (indice; indice > 0; indice--) {
            this.telefonos.children[indice].remove()
        }
        for (let j = 1; j < telefonos.length; j++) {
            let nuevoTelefono = document.createElement('div')
            nuevoTelefono.classList.add("form-control")
            nuevoTelefono.innerHTML = `  
            <div class="form-subcontrol">
              <input class="input-form" type="tel" id="ctn${j}" value="${telefonos[j].numero}" required>
              <label class="label-input" for="ctn${j}">* Telefono</label>
            </div>
            <div class="form-subcontrol">
              <input class="input-form" type="text" id="ctt${j}" value="${(telefonos[j].tipo == 'Sin especificar')?'':telefonos[j].tipo}">
              <label class="label-input" for="ctt${j}">Tipo</label>
            </div>`
            this.telefonos.appendChild(nuevoTelefono)
        }
        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].tagName === 'INPUT') {
                this.form[i].classList.add('vality-input')
                this.form[i].nextElementSibling.classList.add('input-full')
            }
        }
        this.cantidadTelefonos = this.telefonos.children.length
        if (this.cantidadTelefonos > 1) {
            this.quitarTelefonoBtn.removeAttribute('disabled')
        } else if (this.cantidadTelefonos > 5) {
            this.agregarTelefonoBtn.setAttribute('disabled', '')
        }
        this.eventBlur()
        this.formTitle.innerHTML = 'Editar cliente:'
        this.enviarBtn.innerHTML = 'Guardar Cambios'
        this.cancelarBtn.classList.add('show-button')
    }

    resetForm() {
        for (let i = 0; i < this.form.length - 1; i++) {
            this.form[i].value = ""
            this.form[i].nextElementSibling
                .classList.remove("input-full")
            this.form[i].classList.remove("vality-input")
            this.form[i].classList.remove("invality-input")
        }
        this.telefonos.innerHTML = `
            <div class="telefonos-container"> 
            <div class="form-control">
            <div class="form-subcontrol">
              <input class="input-form" type="tel" id="ctn0" required>
              <label class="label-input" for="ctn0">* Telefono</label>
            </div>
            <div class="form-subcontrol">
              <input class="input-form" type="text" id="ctt0">
              <label class="label-input" for="ctt0">Tipo</label>
            </div>
            </div>`
        this.cantidadTelefonos = 1
        this.quitarTelefonoBtn.setAttribute('disabled', '')
        this.agregarTelefonoBtn.removeAttribute('disabled')
        this.formTitle.innerHTML = 'Nuevo Cliente:'
        this.cancelarBtn.classList.remove('show-button')
        this.enviarBtn.innerHTML = 'Agregar a tabla'
        this.showAlert()
        this.eventBlur()
    }

}
let clientes = new Clientes(),
    formCliente = new FormCliente(document.querySelector(".form-clientes"))

const eventosConfig = () => {
    for (let i = 0; i < clientes.listaClientes.length; i++) {
        let config = clientes.table.querySelector(`#tblrw${i}`)
        config.onclick = (evt) => {
            if (evt.target.tagName === 'BUTTON') {
                if (evt.target.classList[1] === 'icon-pencil') {
                    index = clientes.editRow(config)
                    formCliente.resetForm()
                    let desabilitar = clientes.table.querySelectorAll('.icon')
                    for (let i = 0; i < desabilitar.length; i++) {
                        desabilitar[i].setAttribute('disabled', '')
                    }
                    formCliente.editCliente(clientes.listaClientes[index])
                } else {
                    clientes.deletedRow(config)
                    eventosConfig()
                }
            }
        }
    }
}

eventosConfig()
formCliente.form.onsubmit = (evt) => {
    evt.preventDefault()
    newCliente = formCliente.creandoCliente(evt)
    clientes.nuevoCliente(newCliente)
    formCliente.resetForm()
    eventosConfig()
}
formCliente.form.oninput = (evt) => { formCliente.validar(evt.target) }
formCliente.agregarTelefonoBtn.onclick = () => { formCliente.agregarTelefono() }
formCliente.quitarTelefonoBtn.onclick = () => { formCliente.quitarTelefono() }
formCliente.cancelarBtn.onclick = () => {
    formCliente.resetForm()
    clientes.updateTable()
}