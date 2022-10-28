const btn = document.querySelector(".btn-get-post");
const sendBtn = document.querySelector(".btn-send-post");
const container = document.querySelector('.container');
function cardItem(post){
    const card = document.createElement('div');
    card.classList.add('card');
    const cardBody = document.createElement("div");
    cardBody.classList.add('card-body');
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.classList.add('card-body');
    body.textContent = post.body;
    cardBody.appendChild(title);
    cardBody.appendChild(body);
    card.appendChild(cardBody);
    return card;
}
function getPosts(callback){
    //создаем экземпляр класса XMLHttpRequest
    const xhr = new XMLHttpRequest();
//открываем запрос
    xhr.open('GET','https://jsonplaceholder.typicode.com/posts');
//подписываемся на события загрузки и  получения данных от сервера
    xhr.addEventListener("load", () =>{

        const request = JSON.parse(xhr.responseText)// переводим из JSON в массив
        callback(request)
    }) /*load - соединение с сервером произошло успешно
xhr.responseText здесь хранится ответ от сервера*/
//подписываемся на ошибки
    xhr.addEventListener("error", () =>{
        console.log('error')
    })
//отправляем запрос
    xhr.send();
}
function createPosts(body, callback){
    //создаем экземпляр класса XMLHttpRequest
    const xhr = new XMLHttpRequest();
//открываем запрос
    xhr.open('POST','https://jsonplaceholder.typicode.com/posts');
//подписываемся на события загрузки и  получения данных от сервера
    xhr.addEventListener("load", () =>{
        const responce = JSON.parse(xhr.responseText)
        callback(responce)
    }) /*load - соединение с сервером произошло успешно
xhr.responseText здесь хранится ответ от сервера*/
//подписываемся на ошибки
    xhr.addEventListener("error", () =>{
        console.log('error')
    })
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8)');
//отправляем запрос
    xhr.send(JSON.stringify(body));
}

//Вешаем на кнопку слушатель события и предаем в нашу функцию qetPosts ответ от сервера + вставляем ответ в html разметку
btn.addEventListener("click", (e) =>{
    getPosts((responce) =>{
        const fragment = document. createDocumentFragment();
        responce.forEach(post => {
            const card = cardItem(post);
            fragment.appendChild(card)
        })
        container.appendChild(fragment)
    })
})

sendBtn.addEventListener('click', (e) => {
    const newPost = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };
    createPosts(newPost, response => {
        console.log(response)
        const card = cardItem(response);
        container.insertAdjacentElement("afterbegin", card);

        console.log(card)
    })
})

function httpRequest({method, url} = {}, callback){
    try{
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.addEventListener("load", () =>{
            if(Math.floor(xhr.status/100 !== 2)){
                callback(`Error. status code ${xhr.status}`, xhr)
                return
            }
            const request = JSON.parse(xhr.responseText)// переводим из JSON в массив
            callback(null, request)
        })
        xhr.addEventListener("error", () =>{
            callback(`Error. status code ${xhr.status}`, xhr)
        })
        xhr.send();
    }
    catch (error){
        callback(error)
    }
}
/*httpRequest({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts'
}, (error, response) => {
    if(error){
        console.log(error)
    }
    console.log(response)})*/

//Универсальный запрос
function httpUniversal(){
    return{
        get(url, callback){
            try{
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.addEventListener("load", () =>{
                    if(Math.floor(xhr.status/100 !== 2)){
                        callback(`Error. status code ${xhr.status}`, xhr)
                        return
                    }
                    const request = JSON.parse(xhr.responseText)// переводим из JSON в массив
                    callback(null, request)
                })
                xhr.addEventListener("error", () =>{
                    callback(`Error. status code ${xhr.status}`, xhr)
                })
                xhr.send();
            }
            catch (error){
                callback(error)
            }
        },
        post(url, body, headers, callback){
            debugger;
            try{
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.addEventListener("load", () =>{
                    if(Math.floor(xhr.status/100 !== 2)){
                        callback(`Error. status code ${xhr.status}`, xhr)
                        return;
                    }
                    const request = JSON.parse(xhr.responseText);// получаем объект из JSONстрок
                    callback(null, request)
                })
                xhr.addEventListener("error", () =>{
                    console.log('error')
                   /* callback(`Error. status code ${xhr.status}`, xhr)*/
                })
                if(headers){
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value)
                    })
                }
                xhr.send(JSON.stringify(body));//переводим объект в JSONстроку
            }
            catch (error){
                callback(error);
            }
        }
    }
}
const h = httpUniversal();
h.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
        title: 'foo',
        body: 'bar',
        userId: 1,
    },
    {'Content-type': 'application/json'},
    (error, responce) => {
    console.log(error, responce)
    }
    )


