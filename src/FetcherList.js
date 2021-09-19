import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import isEqual from 'react-fast-compare';
import qs from 'query-string';
// import { resultSerializers } from './serializers';
import dataStates from './dataStates';


class FetcherList extends Component {

  constructor(props) {
    super(props)
    let data = {
      count: 0,
      results: []
    };
    const { location, initFilter } = this.props;
    const { search } = location;
    const queryParams = qs.parse(search);
    let status = dataStates.loading;
    if (this.props.initData) {
      const { initData } = this.props;
      data = { ...initData }
      status = dataStates.loaded;
    }
    const filterParams = { ...queryParams, ...initFilter };
    this.state = {
      next: null,
      previous: null,
      activePage: queryParams.page ? Number(queryParams.page) : 1,
      ...data,
      status,
      filterParams,
      isConcat: false,
    }
  }

  isNext = () => !!this.state.next;
  isPrev = () => !!this.state.previous;

  fetcher = (activePage, filterParams) => {
    const { isConcat } = this.state;
    const { api, handleSuccess, handleError, handleBeforeRequest } = this.props;
    const oldResult = this.state.results;

    if (handleBeforeRequest) {
      handleBeforeRequest();
    }
    api({ ...filterParams, page: activePage })
      .then(res => {
        const {
          next,
          previous,
          count,
          results,
          ...otherData
        } = res;
        this.scrollTop();
        this.setState({
          next,
          previous,
          count,
          results: isConcat && activePage !== 1 ? [...oldResult, ...results] : results,
          isConcat: false,
          activePage,
          status: dataStates.loaded,
          otherData
        }, () => {
          if (handleSuccess) {
            handleSuccess();
          }
        });
      })
      .catch(error => {
        this.setState({
          next: null,
          previous: null,
          status: dataStates.failed,
          count: 0,
          results: []
        }, () => {
          if (handleError) {
            handleError();
          }
        });
      })
  }

  reload = () => {
    const { activePage, filterParams } = this.state;
    this.setState({
      status: dataStates.loading,
    }, () => this.fetcher(activePage, filterParams))
  }

  componentDidMount() {
    const { initData } = this.props;
    const { activePage, filterParams } = this.state;
    if (!initData) {
      this.fetcher(activePage, filterParams);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { props } = this;
    const { location, isHistoryPush, enableReinitialize } = props;
    const { search } = location;
    if (enableReinitialize) {
      if (!isEqual(props.initFilter, prevProps.initFilter)) {
        const filterParams = {
          ...this.state.filterParams,
          ...props.initFilter,
        };
        this.objToStateAndLoad(filterParams)
      }
    } else {
      if (prevProps.location.search !== search && isHistoryPush === true) {
        this.searchToStateAndLoad(search);
      }
    }
  }

  scrollTop = () => {
    const { isConcat } = this.state;
    const { isScrollTop, scrollElement } = this.props;
    if (isScrollTop === false || isConcat === true) return false;
    if (window && window.scrollTo) {
      if (scrollElement) {
        window.scrollTo(0, scrollElement.current.offsetTop - 50)
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }

  getData = () => {
    const { activePage, filterParams } = this.state;
    this.fetcher(activePage, filterParams);
  }

  searchToStateAndLoad = (search) => {
    const filterParams = qs.parse(search);
    this.objToStateAndLoad(filterParams);
  }

  objToStateAndLoad = filterParams => {
    this.setState({
      filterParams,
      activePage: filterParams.page ? Number(filterParams.page) : 1,
      status: dataStates.loading,
    }, () => this.getData())
  }

  loadData = (page, filterParams, isConcat = false) => {
    const { history, isHistoryPush } = this.props;
    if (isHistoryPush === true) {
      this.setState({
        isConcat
      }, () => {
        const queryParams = qs.stringify({
          ...filterParams,
          page,
        });
        history.push({
          search: queryParams
        });
      })
    } else {
      this.setState({
        isConcat,
        filterParams,
        activePage: page,
        status: dataStates.loading,
      }, () => this.getData())
    }
  }

  showMore = () => {
    const { filterParams, activePage } = this.state;
    this.loadData(activePage + 1, filterParams, true);
  }

  deleteElement = index => {
    const { results, count } = this.state;
    const newResult = [...results];
    newResult.splice(index, 1)
    this.setState({
      results: newResult,
      count: count - 1,
    })
  }

  deleteElementByKey = (value, key = 'id') => {
    const { results, count } = this.state;
    const newResult = [...results].filter(item => item[key] !== value);
    this.setState({
      results: newResult,
      count: count - 1,
    })
  };

  updateElement = (index, obj) => {
    const { results } = this.state;
    const newResult = [...results];
    newResult[index] = obj;
    this.setState({
      results: newResult
    });
  }

  updateElementByKey = (obj, value, key = 'id') => {
    const { results } = this.state;
    const newResult = [...results];
    const index = newResult.findIndex(item => item[key] === value);
    if (index === -1) return false;
    const element = newResult[index];
    newResult[index] = { ...element, ...obj };
    this.setState({
      results: newResult
    });
  }

  render() {
    return <>{this.props.children({
      ...this.state,
      showMore: this.showMore,
      loadData: this.loadData,
      reload: this.reload,
      deleteElement: this.deleteElement,
      updateElement: this.updateElement,
      deleteElementByKey: this.deleteElementByKey,
      updateElementByKey: this.updateElementByKey,
      isNext: this.isNext(),
      isPrev: this.isPrev()
    })}</>;
  }
}

FetcherList.propTypes = {
  children: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  initData: PropTypes.object,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

FetcherList.defaultProps = {
  isHistoryPush: true,
  isScrollTop: true,
  enableReinitialize: false
};

export default withRouter(FetcherList)
