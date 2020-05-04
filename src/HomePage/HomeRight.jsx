import React from 'react';
import './HomeRight.less';
import { Collapse } from 'antd';
import HomeToolFootball from './HomeRightTools/Football'
import HomeToolBaiduyun from './HomeRightTools/Baiduyun'
import HomeToolIpSearch from './HomeRightTools/IpSearch'

const { Panel } = Collapse;

export default class HomeRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="HomeRight" >
                <div className="HomeRight-tools">
                    <Collapse accordion>
                        <Panel className="HomeRight-tools-football" header="足球六大联赛积分榜" key="1">
                            <HomeToolFootball></HomeToolFootball>
                        </Panel>
                        <Panel className="HomeRight-tools-ipSearch" header="ip信息查询" key="2">
                            <HomeToolIpSearch></HomeToolIpSearch>
                        </Panel>
                        <Panel className="HomeRight-tools-baiduyun" header="百度网盘提取码查询" key="3">
                            <HomeToolBaiduyun></HomeToolBaiduyun>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        );
    }
}
