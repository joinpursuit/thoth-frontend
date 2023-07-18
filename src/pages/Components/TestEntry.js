import { useState } from "react"

const TestEntry = ({testEntry, idx, lastRunResults}) => {

  const [active, setActive] = useState(false);

  const onTabClick = (e) => {
    e.preventDefault();
    setActive(!active);
  }

  // Hacky way of getting around generative differences between the descriptions in the test data and cases
  const testCase = lastRunResults?.find(
    result => result.description === testEntry.description || result.description.includes(testEntry.description)
  );

  const highlight = testCase ? (
    testCase.passing ? (
      "workspace-test-passing"
    ) : (
      "workspace-test-failing"
    )
  ) : "";

  return (
    <div className="workspace-test-entry" onClick={onTabClick}>
      <div className="workspace-test-handle">
        <span>{ testEntry.description }</span>
      </div>

      {
        active ? (
          <div className={`workspace-test-content ${highlight}`}>
            <p>Input: { JSON.stringify(testEntry.input) }</p>
            <p>Expected: { JSON.stringify(testEntry.expected) }</p>
            {
              testCase && !testCase.passing ? (
                <>
                  <p>Actual: { JSON.stringify(testCase?.received) }</p>
                </>
              ) : (
                null
              )
            }
            
          </div>
        ) : (
          null
        )
      }
    </div>
  )
}

export default TestEntry;