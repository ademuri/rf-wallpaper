import * as React from 'react';
import { useState } from 'react';
import './App.css';
import { Sketch } from './components/p5-sketch';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { formatNumber } from './math/math';
function App() {
    var _a = useState(0), frequency = _a[0], setFrequency = _a[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "sketch-container" },
            React.createElement(ReactP5Wrapper, { sketch: Sketch, setFrequency: setFrequency })),
        React.createElement("div", null,
            React.createElement("span", null,
                "Frequency: ",
                formatNumber(frequency, 3),
                "Hz"))));
}
export default App;
//# sourceMappingURL=App.js.map