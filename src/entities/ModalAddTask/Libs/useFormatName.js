import React from 'react'

const useFormatName = ({firstName, lastName}) => {
  if (!lastName) return firstName;

  const formattedLastName = `${lastName.charAt(0)}.`;

  return `${firstName} ${formattedLastName}`;
}

export default useFormatName
