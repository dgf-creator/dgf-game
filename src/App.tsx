import { useState } from 'react'
import { markdown } from './common/markdown'
import { ActionButton } from './components/ActionButton'
import { Block } from './components/Block'
import { IconButton } from './components/IconButton'
import { ToggleIconButton } from './components/ToggleIconButton'

function App() {
  const [foo, setFoo] = useState(false)

  return (
    <div className='flex flex-col items-center'>
      {/* Left margin line */}
      <div className='vertical-rule' />
      {markdown`
        # Hello World
        test
        test
        ${(
          <Block color='pink' style='left-block'>
            i took an action
          </Block>
        )}
        ${(
          <Block color='blue' style='rounded'>
            then something spooooooky happened
          </Block>
        )}
        ${(
          <Block color='purple' style='rounded'>
            then something spooooooky happened
          </Block>
        )}

        Then I decided it was time to ${(<ActionButton linkTo='/test'>reach my hand out</ActionButton>)} and touch his face
      `}
      <ActionButton>hi, i am a button to be tested</ActionButton>
      <ActionButton>you know, i am a button too</ActionButton>
      <ActionButton>don't leave me out guys!</ActionButton>
      <ActionButton>is there room for another button in here?</ActionButton>
      <ActionButton>i hope im not too late</ActionButton>
      <ActionButton>im the last one, i swear</ActionButton>
      <IconButton icon='heart' defaultIconState='start' hoverIconState='end' size='small'>
        you've got mail!
      </IconButton>
      <ToggleIconButton
        icon='menu'
        on={foo}
        onToggle={setFoo}
        defaultIconState='menu'
        toggledIconState='close'
        size='xLarge'
      />
    </div>
  )
}

export default App
