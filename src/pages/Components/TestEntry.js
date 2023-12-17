import { useState } from "react"

const TestEntry = ({testEntry, idx, lastRunResults}) => {

  const [active, setActive] = useState(false);

  const onTabClick = (e) => {
    e.preventDefault();
    setActive(!active);
  }

  const passed = (lastRunResults?.passed || []).find(result => result.description === testEntry.description);
  const failed =( lastRunResults?.failed || []).find(result => result.description === testEntry.description);

  const testCase = passed || failed;

  const highlight = testCase ? (
    passed ? (
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
              testCase?.actual ? (
                <>
                  <p>Actual: { JSON.stringify(testCase.actual) }</p>
                </>
              ) : (
                null
              )
            }
            {
              testCase && testCase.exception ? (
                <>
                  <p>Exception: { testCase.exception }</p>
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