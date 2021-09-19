import React from 'react'
import { Fetcher, FetcherList } from 'fetcher';

const getPublicList = async (params = {}, queryParams) => {
  const stringParams = new URLSearchParams(queryParams);
  const response = await fetch(`https://mult.igra-jeka.ru/api/v1/content/scene/public_list/?${stringParams}`);
  const result = await response.json();
  return {
    mySuperData: [1, 2, 3],
    ...result
  };
}

const App = (props) => {
  console.log(props, 'props')
  return (
    <Fetcher
      {...props}
      paramsKey={'0'}
      fetchInitialData={getPublicList}
      abortCallback={token => {
        console.log(token);
      }}
    >
      {(data, error, status) => {
        console.log(status, 'status')
        return (
          <FetcherList
            api={getPublicList}
            handleSuccess={() => console.log('handleSuccess')}
            handleBeforeRequest={() => console.log('handleBeforeRequest')}
          >
            {(data) => {
              const {
                results,
                otherData,
                reload,
                status
              } = data;
              return (
                <div>
                  {status}
                  <button onClick={reload} type="button">reload</button>
                  {JSON.stringify(results)}
                  {JSON.stringify(otherData)}
                </div>
              );
            }}
          </FetcherList>
        )
      }}
    </Fetcher>
  )
}

export default App
