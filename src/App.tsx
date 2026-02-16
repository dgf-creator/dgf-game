import { markdown } from './common/markdown'
import { ActionButton } from './components/ActionButton'
import { IconButton } from './components/IconButton'

function App() {
  return (
    <div className='flex flex-col items-center'>
      {markdown`
# Testing buttons
----------------------------------
_foo_ **bar**

${(<ActionButton>hi, i am a button to be tested</ActionButton>)}
  # asdf
_test_
${(
  <IconButton icon='heart' iconPosition='left' size='small' iconSpeed={1} defaultIconState='start' hoverIconState='end'>
    I am a button
  </IconButton>
)}
      `}
      <ActionButton>hi, i am a button to be tested</ActionButton>
      <ActionButton>you know, i am a button too</ActionButton>
      <ActionButton>don't leave me out guys!</ActionButton>
      <ActionButton>is there room for another button in here?</ActionButton>
      <ActionButton>i hope im not too late</ActionButton>
      <ActionButton>im the last one, i swear</ActionButton>
    </div>
  )
}

export default App
