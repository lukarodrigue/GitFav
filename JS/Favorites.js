import { GithubUsers } from "./GitHubUser.js"

// classe que vai conter a logica dos dados
// como os dados serão estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GithubUsers.search('lukarodrigue').then(user => console.log(user))

    }

    load() {
        this.entrys = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }


    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entrys))
    }


     async add(username) {
        try {
            const userExists = this.entrys.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuario Já cadastrado!')
            }

            const user = await GithubUsers.search(username)
            
            if(user.login === undefined) {
                throw new Error('Usuario não Encontrado!')
            }
            
            this.entrys = [user, ...this.entrys] 
            this.update()   
            this.save()

        } catch(error) {
            alert(error.message)
        }

       
    }



    delete(user) {
        const filteredEntrys = this.entrys.filter(entrys => entrys.login !== user.login)
    
        this.entrys = filteredEntrys
        this.update()
        this.save()
        if (this.entries.length === 0) {
            this.removeAllTr();
            this.addNoUserRow();
          }
        }
      
        addNoUserRow() {
          const tbody = this.root.querySelector("tbody");
          const noUserRow = document.createElement("tr");
          noUserRow.className = "tr-no-user";
          noUserRow.innerHTML = `
                  <td colspan="4">
                      <div class="no-user">
                          <img src="/assets/Estrela.svg" alt="ícone de uma estrela com uma expressão de surpresa">
                          <span>Nenhum favorito ainda</span>
                      </div>
                  </td>
              `;
          tbody.appendChild(noUserRow);
        }
      }
    



// classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root) //essa linha faz a ligação da classe
    
        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        
    }


    onadd() {
        const addButton = this.root.querySelector('header button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.input-wrapper input')
        
            this.add(value)
        }
    
    }






    update() {
        this.removeAllTr()

    

        this.entrys.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositoires').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
               const isOk =  confirm('Tem certeza que deseja deletar essa linha?')
               if(isOk) {
                this.delete(user)
               }
            }


            this.tbody.append(row)
        })

        const empty = this.root.querySelector('.boxEmpty');

        if (this.entrys.length === 0) {
            empty.classList.remove('hide');
        } else {
            empty.classList.add('hide');
        }

    }


    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
                    <td class="user">
                        <img src="https://github.com/lukarodrigue.png" alt="">
                        <a href="https://github.com/lukarodrigue" target="_blank">
                            <p>luka rodrigues</p>
                            <span>/lukarodrigue</span>
                        </a>
                        
                    </td>
                    <td class="repositoires">
                        0
                    </td>
                    <td class="followers">
                        0
                    </td>
                    <td>
                        <button class="remove" >Remove</button>
        `
    
        return tr
    }

   
    
    removeAllTr () {
        

        this.tbody.querySelectorAll('tbody tr').forEach ((tr) => {
            tr.remove()
        }) 
    }
}