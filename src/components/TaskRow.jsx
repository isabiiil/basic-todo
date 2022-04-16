import React, { useState } from 'react'

export default function TaskItem({ task, check }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={styles.container}>
      <input type="checkbox" style={styles.checkbox} onChange={ () => { setChecked(!checked) }} />
      <p className={checked ? 'line-through' : ''}>
        {task}
      </p>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '40px',
    margin: '24px 2px',
    backgroundColor: '#3f51b5',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  checkbox: {
    margin: '4px',
  },
}