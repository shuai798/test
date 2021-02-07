import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import ExtensibleSearch from './components/ExtensibleSearch';
import BaseSearch from './components/BaseSearch';
import ShortSearch from './components/ShortSearch';


class SearchCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <ExtensibleSearch></ExtensibleSearch>
                </div>
                <div className="content mt20">
                    <BaseSearch></BaseSearch>
                </div>
                <div className="content mt20">
                    <ShortSearch></ShortSearch>
                </div>

            </div>
        );
    }
}

export default SearchCondition;
