import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import initial from '../data.json';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';
import ContactForm from './ContactForm/ContactForm';
import Wrapper from './Wrapper/Wrapper.styled';
import { MainHeading, SecondaryHeading } from './Heading/Heading.styled';

const LS_KEY = 'contacts';

export function App() {
  const [contacts, setContacts] = useState(initial);
  const [filter, setFilter] = useState('');

  // debugger;
  // useEffect работает максимально не корректно, на первом рендере обновляет LocalStorag всегда массивом initial

  // ????????????????????????????????
  const firstRender = useRef(true);
  // ????????????????????????????????

  useEffect(() => {
    console.log('useEffect mount');
    const parsedContacts = JSON.parse(localStorage.getItem(LS_KEY));
    if (parsedContacts?.length > 0) {
      console.log(parsedContacts);

      setContacts(parsedContacts);

      // console.log(contacts);
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      console.log('useEffect update');
      // console.log(contacts);

      localStorage.setItem(LS_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  const handelSubmit = e => {
    e.preventDefault();
    const newName = e.target.elements.name.value;
    const newNumber = e.target.elements.number.value;
    const findeName = contacts.some(contact =>
      contact.name.toLowerCase().includes(newName.toLowerCase())
    );
    const findeNumber = contacts.some(contact =>
      contact.number.trim().includes(newNumber.trim())
    );

    const newContact = [
      {
        id: nanoid(),
        name: newName,
        number: newNumber,
      },
    ];

    if (!findeName && !findeNumber) {
      setContacts(prevContacts => [...prevContacts, ...newContact]);
      e.target.reset();
    } else {
      alert(`${newName} is already in contacts`);
    }
  };

  const handleChange = e => {
    const value = e.target.value;
    setFilter(value);
  };

  const daleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const normalizedFilter = filter.toLocaleLowerCase();
  const visibleContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(normalizedFilter)
  );

  return (
    <Wrapper>
      <MainHeading>Phonebook</MainHeading>
      <ContactForm onSubmiting={handelSubmit} />
      <SecondaryHeading>Contacts</SecondaryHeading>
      <Filter value={filter} onChange={handleChange} />
      {visibleContacts.length !== 0 && (
        <ContactList
          contacts={visibleContacts}
          onDeleteContact={daleteContact}
        />
      )}
    </Wrapper>
  );
}
