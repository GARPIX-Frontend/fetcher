import React, { PureComponent } from "react";
import { connectStoreon } from 'storeon/react';
import qs from 'query-string';
import { PageContainer } from "./PageContainer";
import dataStates from "./dataStates";


class Fetcher extends PureComponent {
  constructor(props) {
    super(props);
    let data;
    let status = dataStates.loading;
    if (window.__INITIAL_DATA__) {
      data = window.__INITIAL_DATA__;
      status = dataStates.loaded;
    } else {
      if (this.props.staticContext) {
        const { initData } = this.props.staticContext;
        data = initData;
        status = dataStates.loaded;
      }
    }
    this.data = {
      status,
      data,
      error: null
    };
    this.dispatch(this.data)
  }

  dispatch = (state) => {
    this.props.dispatch('page/set', {
      page: state
    })
  };

  componentDidMount() {
    if (!this.data.data) {
      this.getData()
    }
  }

  componentDidUpdate(prevProps) {
    const { paramsKey = 'slug' } = this.props;
    if (prevProps.match.params[paramsKey] !== this.props.match.params[paramsKey]) {
      this.getData()
    }
  }

  componentWillUnmount() {

  }

  getData = () => {
    const { fetchInitialData } = this.props;
    if (!fetchInitialData) return false;

    this.props.dispatch('page/set/status', {
      status: dataStates.loading
    });
    this.fetch()
  };

  fetch = () => {
    const { fetchInitialData, match, isScrollTo = true, location } = this.props;
    const { search } = location;
    const queryParams = qs.parse(search);
    fetchInitialData(match.params, queryParams)
      .then(res => {
        if (isScrollTo) {
          window.scrollTo({ top: 0 });
        }
        const state = {
          status: dataStates.loaded,
          data: res,
          error: null
        };
        this.dispatch(state);
      })
      .catch(error => {
        const state = {
          status: dataStates.failed,
          data: null,
          error
        };
        this.dispatch(state);
      })
  };

  render() {
    // const { data, error } = this.state;
    return <PageContainer Component={this.props.children} />
  }
}

export default connectStoreon('page', Fetcher);
