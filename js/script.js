async function renderList() {
  const peopleRes = await fetch('../data.json')
  const peopleData = await peopleRes.json();
  const maxPeopleNumberInList = 3

  
  peopleData.forEach(friend => {
    const friendId = friend.id
    friend.popular = 0
    peopleData.forEach(person => {
      if (person.friends.includes(friendId)) {
        friend.popular++
      }
    })
  })
  
  const peopleSortedByPopularAndName = peopleData.sort((a, b) => {
    if (a.popular < b.popular) return 1
    if (a.popular === b.popular) {
      return a.name > b.name? 1 : -1
    }
    return -1
  });
  
  const popularPeople = [];
  for (let i = 0; i < maxPeopleNumberInList; i++) {
    popularPeople.push(peopleSortedByPopularAndName[i])
  }

  const popularList = document.querySelector('.popular')
  const personTemplate = document.querySelector('#person');

  popularPeople.forEach(person => {
    const personClone = personTemplate.content.cloneNode(true);

    personClone.querySelector('span').textContent = person.name
    popularList.appendChild(personClone);
  })

  
  const contactTemplate = document.querySelector('#contact');
  const contactsList = document.querySelector('.contacts-list')
  
  peopleData.forEach(person => {
    const contactClone = contactTemplate.content.cloneNode(true);
    contactClone.querySelector('strong').textContent = person.name
    contactsList.appendChild(contactClone);
  })

  const contactItems = document.querySelectorAll('.contacts-list__item')
  const listView = document.querySelector('.list-view')

  const detailsView = document.querySelector('.details-view')
  const backButton = document.querySelector('.details__back')
  const detailsName = document.querySelector('.details__background strong')

  contactItems.forEach(contact => {
    contact.addEventListener('click', () => {
      contact.classList.add('opened')
      detailsView.classList.add('shown')
      listView.classList.remove('shown')

      const contactName = contact.querySelector('strong').innerHTML

      detailsName.innerHTML = contactName
    })
  })

  backButton.addEventListener('click', () => {
    detailsView.classList.remove('shown')
    listView.classList.add('shown')
  })


  
}

window.addEventListener('load', () => {
  renderList()
})