import React from 'react';
import {
  createInstance,
  OptimizelyProvider,
  useDecision,
} from '@optimizely/react-sdk';


function App() {

  const userIds = [];

  // generate random user ids to represent visitors. each visitor will get randomly & deterministically bucketed into a flag variation
  while (userIds.length < 10) {
    userIds.push((Math.floor(Math.random() * 999999) + 100000).toString())
  }

  // for each visitor, decide the feature flag experience they get  
  const experiences = userIds.map((userId) => {
    // Note: Normally only one instance of Optimizely is created with createInstance in an application
    // at the start of the applicaiton. However, this application simulates multiple experiences for educational
    // purposes
    const optimizely = createInstance({
      sdkKey: 'MuTdQu9yFZzFAKfncdCkH',
      datafileOptions: {
        updateInterval: 1000,
        autoUpdate: true,
        urlTemplate: 'https://cdn.optimizely.com/datafiles/MuTdQu9yFZzFAKfncdCkH.json',
      }
    })

    // Note: Normally OptimizelyProvider is only used once to wrap an entire application
    // But this app simulates multiple experiences for educational purposes

    // create a user and decide a flag rule (such as an A/B test) for them
    return (
      <OptimizelyProvider
        optimizely={optimizely}
        user={{ id: userId }}
      >
        <Decide/>
      </OptimizelyProvider>
    )
  });

  return (
    <div>
      <pre>Welcome to our product catalog!</pre>
      <pre>Let's see what product sorting the visitors experience!</pre>
        { experiences }
      <pre>Update the feature flag from the tutorial and refresh this page to show the updated visitor's experiences!</pre>
    </div>
  );
}

function Decide() {
  const [decision] = useDecision('product_sort', { autoUpdate: true, updateInterval: 1000 });
  const text = decision.variables['sort_method'];
  const banner = decision.variables['url_banner'];
  return (
    <div>
      {
        decision.enabled
          // mocks config values with print statements like "Variation 1 shows popular products first!" 
          ? <pre style={styles.experience}>{`[DEBUG: Feature ON] ${text} ${banner}`} </pre>
          // default fallback if flag off for user
          : <pre style={styles.experience}>{`[DEBUG: Feature OFF] Flag off. User saw the product list sorted alphabetically by default.`} </pre>
      }
      <pre>
        {JSON.stringify(decision, null, 2)}
      </pre>
    </div>
  );
}

const styles = {
  experience: {
    margin: 0,
  }
}

export default App;