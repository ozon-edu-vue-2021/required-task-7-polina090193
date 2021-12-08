function cutArray(arr, maxNum) {
  const newArr = []
  for (let i = 0; i < maxNum; i++) {
    newArr.push(arr[i])
  }
  return newArr
}

async function renderList() {
  const peopleRes = await fetch('../data.json')
  const peopleData = await peopleRes.json();
  const maxPeopleNumberInDetailedList = 3

  
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
  
  const popularPeople = cutArray(peopleSortedByPopularAndName, maxPeopleNumberInDetailedList)

  const popularList = document.querySelector('.popular-list')
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
    contactClone.querySelector('li').id = person.id
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

      const personInData = peopleData.find(person => Number(person.id) === Number(contact.id))

      if (personInData) {
        const friendsIds = personInData.friends

        if (friendsIds && friendsIds.length) {
          const friendsList = document.querySelector('.friends-list')
          friendsList.innerHTML = ''
          const fullFriendsArr = peopleData.filter(person => friendsIds.includes(Number(person.id)))
          const shownFriends = cutArray(fullFriendsArr, maxPeopleNumberInDetailedList)

          shownFriends.forEach(person => {
            const personClone = personTemplate.content.cloneNode(true);
            personClone.querySelector('span').textContent = person.name
            friendsList.appendChild(personClone);
          })

          const strangersList = document.querySelector('.strangers-list')
          strangersList.innerHTML = ''
          const fullStrangersArr = peopleData.filter(person => !friendsIds.includes(Number(person.id)))
          const shownStrangers = cutArray(fullStrangersArr, maxPeopleNumberInDetailedList)

          shownStrangers.forEach(person => {
            const personClone = personTemplate.content.cloneNode(true);
            personClone.querySelector('span').textContent = person.name
            strangersList.appendChild(personClone);
          })

        }
      }
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