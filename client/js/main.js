const wrapper = document.querySelector(".wrapper");
const div = document.querySelector("div")
//Getting and displaying not private tutorials
const displayData = async () => {
    wrapper.innerHTML = '';

    const response = await fetch("http://localhost:3000/v1/content/tutorials/tutorials");
    const data = await response.json();

    data.tutorials.forEach(tutorial => {
        const card = document.createElement('div');
        card.className = 'card';

        const h3 = document.createElement('h2');
        h3.innerText = tutorial.title;

        const p = document.createElement('p');
        p.innerText = tutorial.content
        
            wrapper.appendChild(card);
            card.append(h3, p)
    })
    return wrapper
}

displayData()
 // Getting and dispalying total count of tutorials   
const totalTutorials = async () => {
    div.innerHTML = '';

    const response = await fetch("http://localhost:3000/v1/auth/users");
    const data = await response.json();
    data.map(total => {
        const h3 = document.createElement('h3');
        h3.className = 'total';
        h3.innerText = `We have total Tutorials: ${total.COUNT}`

    div.append(h3);
})
    return div
}

totalTutorials()