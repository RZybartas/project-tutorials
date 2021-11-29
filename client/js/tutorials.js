const wrapper = document.querySelector(".wrapper");
// Displaying tutorials for signed user
const displayData = async () => {
    wrapper.innerHTML = '';
    
    const response = await fetch("http://localhost:3000/v1/content/user-tutorials", {
        method: 'GET',
        headers: {
            authorization:
            `Bearer ${sessionStorage.getItem("token")}`
        }
    });
    const data = await response.json();
    
    data.forEach(tutorial => {
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