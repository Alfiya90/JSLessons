const btn = document.querySelector('button')
const container = document.querySelector('.container')
const userContainer = document.querySelector('.userContainer')
//1. Получаем экземпляр запросаю.
// 2.Открываем его, указывая тип запроса и адрес.
//3. Добавляем слушатель событий. После загрузки
//4. записываем ответ от сервера (xhr.responseText- здесь хранится ответ от сервера) и переводим JSON в массив
//5. Отправляем запрос
// Таким образом мы создали функцию отправляющую ответ на страницу.
function getUsers (callback){
    const  xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
    xhr.addEventListener('load', () =>{
        const responce = JSON.parse(xhr.responseText);
        callback(responce);
    })
    xhr.send();
}
function getUserInfoHttp(id, callback){
    const  xhr = new XMLHttpRequest();
    xhr.open('GET', `https://jsonplaceholder.typicode.com/users/${id}`);
    xhr.addEventListener('load', () =>{
        const request = JSON.parse(xhr.responseText);
        callback(request);
    })
    xhr.send();
}
function getUsersName(responce){
    const fragment = document.createDocumentFragment();
    responce.forEach(user => {
        const card = document.createElement('div');

        const cardBody = document.createElement('div');
        const name = document.createElement('p');
        name.classList.add('user')
        card.setAttribute('data-user-id', `${user.id}`)
        name.textContent = user.name;
        cardBody.appendChild(name);
        card.appendChild(cardBody);
        fragment.appendChild(card);

        card.addEventListener('click', (e)=>{
            if(user.id){
                getUserInfoHttp(user.id, onGetUsetInfoCallback )
            }

        })
    })
    userContainer.appendChild(fragment);



}

function  onGetUserInfoCallback(user){
    console.log(user)
    if(!user.id){
        console.log('User is not found')
        return;
    }
    renderUserInfo(user)
}

function renderUserInfo(user){
    const card = document.querySelectorAll(`div[data-user-id=\'${user.id}\']`)[0];
    const detail = document.createElement('p');
    detail.textContent = JSON.stringify(user)
    card.appendChild(detail);
}
btn.addEventListener('click', (e) => {
    getUsers(getUsersName)
})


