import React, {Component} from 'react';

import {asyncComponent} from '../../../utils'

// import GoodsViewTop from './GoodsViewTop';
import GoodsViewTab from './GoodsViewTab';
import {Loading} from '../../common';

import GoodsViewTopContainer from '../../../containers/GoodsViewTopContainer';

class GoodsView extends Component{

    state = {
        GoodsDetail: null
    }

    componentDidMount(){
        window.scrollTo(0, 0);
        this.handleDetailView('detail');
    }

    handleDetailView = (tabName) =>{
        switch(tabName){
            case 'detail':
                this.setState({
                    GoodsDetail: asyncComponent(() => import('./GoodsViewDetail'))
                });
                break;
            case 'review':
                this.setState({
                    GoodsDetail: asyncComponent(() => import('./GoodsViewReview'))
                });
                break;
            case 'qna':
                this.setState({
                    GoodsDetail: asyncComponent(() => import('./GoodsViewQna'))
                });
                break;
            case 'policy':
                this.setState({
                    GoodsDetail: asyncComponent(() => import('./GoodsViewPolicy'))
                });
                break;
            default:
        }
    }


    render(){
        const {GoodsDetail} = this.state;
        const {isMobile} = this.props;

        return(
            <Loading>
                <article className="article">
                    <GoodsViewTopContainer />
                    <GoodsViewTab handleDetailView={this.handleDetailView} />
                    {GoodsDetail && <GoodsDetail isMobile={isMobile}  />}
                </article> 
            </Loading>
        )
    }
}

export default GoodsView;