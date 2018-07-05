import React from 'react';
import slug from 'slugg';
import {prefixUrl} from '@mapbox/batfish/modules/prefix-url';
import md from '@mapbox/batfish/modules/md'; // eslint-disable-line import/no-unresolved
import PageShell from '../components/page_shell';
import LeftNav from "../components/left_nav";
import TopNav from "../components/top_nav";
import entries from 'object.entries';

const meta = {
    title: 'Curvemap GL JS Plugins',
    description: '',
    pathname: '/plugins'
};

const plugins = {
    "User Interface Plugins": {
        "curvemap-gl-accessibility": {
            "website": "https://github.com/curvemap/curvemap-gl-accessibility/",
            "description": "integrates with ARIA-compatible screen readers for users with visual impairments"
        },
        "curvemap-gl-boundaries": {
            "website": "https://github.com/curvemap/curvemap-gl-boundaries",
            "description": "enables users to show/hide disputed borders"
        },
        "curvemap-gl-compare": {
            "website": "https://github.com/curvemap/curvemap-gl-compare",
            "description": "enables users to compare two maps by swiping left and right",
            "example": "curvemap-gl-compare"
        },
        "curvemap-gl-directions": {
            "website": "https://github.com/curvemap/curvemap-gl-directions",
            "description": "adds a control which allows users to plot driving, walking, and cycling directions on the map",
            "example": "curvemap-gl-directions"
        },
        "curvemap-gl-draw": {
            "website": "https://github.com/curvemap/curvemap-gl-draw",
            "description": "adds support for drawing and editing features on Curvemap GL JS maps",
            "example": "curvemap-gl-draw"
        },
        "curvemap-gl-geocoder": {
            "website": "https://github.com/curvemap/curvemap-gl-geocoder",
            "description": "adds a Geocoder control to Curvemap GL JS",
            "example": "curvemap-gl-geocoder"
        }
    },
    "Map Rendering Plugins": {
        "curvemap-gl-language": {
            "website": "https://github.com/curvemap/curvemap-gl-language/",
            "description": "automatically localizes the map into the user’s language"
        },
        "curvemap-gl-rtl-text": {
            "website": "https://github.com/curvemap/curvemap-gl-rtl-text",
            "description": "adds right-to-left text support to Curvemap GL JS",
            "example": "curvemap-gl-rtl-text"
        },
        "deck.gl": {
            "website": "https://github.com/uber/deck.gl",
            "description": "adds advanced WebGL visualization layers to Curvemap GL JS"
        }
    },
    "Framework Integrations": {
        "echartslayer": {
            "website": "https://github.com/lzxue/echartLayer",
            "description": md`provides an [echarts](https://ecomfe.github.io/echarts/index-en.html) integration for Curvemap GL JS`
        },
        "wtCurvemap": {
            "website": "https://github.com/yvanvds/wtCurvemap",
            "description": md`provides a [Webtoolkit](https://www.webtoolkit.eu/wt) integration for Curvemap GL JS`
        },
        "react-curvemap-gl": {
            "website": "https://github.com/alex3165/react-curvemap-gl",
            "description": md`provides a [React](https://facebook.github.io/react/) integration for Curvemap GL JS`
        },
        "angular-curvemapgl-directive": {
            "website": "https://github.com/Naimikan/angular-curvemapgl-directive",
            "description": md`provides an [AngularJS](https://angularjs.org/) directive for Curvemap GL JS`
        },
        "ngx-curvemap-gl": {
            "website": "https://github.com/Wykks/ngx-curvemap-gl",
            "description": md`provides an [Angular](https://angular.io/) integration for Curvemap GL JS`
        }
    },
    "Utility Libraries": {
        "turf": {
            "website": "http://turfjs.org/",
            "description": "provides advanced geospatial analysis tools"
        },
        "curvemap-gl-layer-groups": {
            "website": "https://github.com/curvemap/curvemap-gl-layer-groups",
            "description": "manages layer groups in Curvemap GL JS"
        },
        "expression-jamsession": {
            "website": "https://github.com/curvemap/expression-jamsession/",
            "description": md`converts [Curvemap Studio formulas](https://www.curvemap.com/help/studio-manual-styles/#use-a-formula) into [expressions](https://www.curvemap.com/curvemap-gl-js/style-spec/#expressions)`
        },
        "simplespec-to-gl-style": {
            "website": "https://github.com/curvemap/simplespec-to-gl-style",
            "description": md`converts GeoJSON styled with [\`simplestyle-spec\`](https://github.com/curvemap/simplestyle-spec/) to a Curvemap GL Style`
        },
        "curvemap-gl-supported": {
            "website": "https://github.com/curvemap/curvemap-gl-supported",
            "description": "determines if the current browser supports Curvemap GL JS",
            "example": "curvemap-gl-supported"
        },
        "curvemap-gl-sync-move": {
            "website": "https://github.com/curvemap/curvemap-gl-sync-move",
            "description": "syncs movement between two Curvemap GL JS maps"
        }
    },
    "Development Tools": {
        "curvemap-gl-js-mock": {
            "website": "https://github.com/curvemap/curvemap-gl-js-mock",
            "description": md`is a [mock](https://en.wikipedia.org/wiki/Mock_object) of Curvemap GL JS`
        },
        "curvemap-gl-inspect": {
            "website": "https://github.com/lukasmartinelli/curvemap-gl-inspect",
            "description": "adds an inspect control to view vector source features and properties"
        },
        "curvemap-gl-fps": {
            "website": "https://github.com/MazeMap/curvemap-gl-fps",
            "description": "A frames-per-seconds GUI control and measurer with statistic report output."
        }
    }
};

export default class extends React.Component {
    render() {
        return (
            <PageShell meta={meta}>
                <LeftNav>
                    <div>
                        {entries(plugins).map(([title, plugins], i) =>
                            <div key={i} className="space-bottom">
                                <a href={prefixUrl(`/plugins/#${slug(title)}`)} className='dark-link block small truncate'>{title}</a>
                                {entries(plugins).map(([name], i) =>
                                    <a key={i} href={prefixUrl(`/plugins/#${slug(name)}`)} className='block small truncate'>{name}</a>
                                )}
                            </div>
                        )}
                    </div>
                </LeftNav>

                <div className='limiter clearfix'>
                    <TopNav current='plugins'/>

                    <div className='contain margin3 col9'>
                        <div id='plugins' className='doc' data-swiftype-index='true'>
                            {entries(plugins).map(([title, plugins], i) =>
                                <div key={i} className='space-bottom4'>
                                    <a id={slug(title)}/>
                                    <h2 className='space-bottom1'>{title}</h2>
                                    {entries(plugins).map(([name, plugin], i) =>
                                        <div key={i} className='space-bottom1 keyline-all pad2 fill-white'>
                                            <a id={slug(name)}/>
                                            <h3><a href={plugin.website}>{name}</a></h3>
                                            { plugin.example && <a
                                                className="small quiet rcon"
                                                href={prefixUrl(`/example/${plugin.example}`)}>view example</a> }
                                            <p>{ plugin.description }</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PageShell>
        );
    }
}
