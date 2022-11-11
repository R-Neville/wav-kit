const NAMESPACE_URI = "http://www.w3.org/2000/svg";

interface SVGAttributeObject {
  attributes: string[][];
}

const universalAttributes = [
  ["stroke-linecap", "round"],
  ["stroke-linejoin", "round"],
  ["fill", "none"],
] as string[][];

const logoPaths = [
  {
    attributes: [
      [
        "d",
        "m40.659 5.8406-20.834 28.891 3.1662 2.5125 20.835-28.891-3.1667-2.512zm-11.962 2.4944-9.9503 13.798 3.1662 2.512 9.9503-13.797-3.1662-2.5125zm14.854 6.3443-14.302 19.833 3.1662 2.512 14.302-19.833-3.1667-2.512zm14.303 8.1199-11.153 1.8924-7.0549 9.6108c-0.49267 2.888-0.20184 4.7081 0.0894 6.5283 0.33455 1.8871 0.43413 3.5021-0.69401 7.5959-2.6684 8.2691-9.1652 16.374-16.17 24.245 0.88739 4.3159 5.3305 9.484 12.046 8.4398 5.2459-9.1866 10.879-17.679 18.1-22.904 3.6831-2.6345 5.2853-2.7665 7.1443-3.082 2.1815-0.5519 3.7181-0.63054 6.3609-2.0138 0.30364-0.08015 4.6787-6.9171 7.0549-9.6108l-1.9239-11.045-10.013 14.006c-5.7783-0.01257-10.59-2.8292-13.976-9.7808l10.19-13.881zm24.547 15.297-18.275 25.342 3.1662 2.512 18.275-25.342-3.1662-2.512zm8.586 0.99787-24.873 34.491 3.1662 2.512 24.873-34.49-3.1662-2.5125zm-2.0278 15.164-9.9503 13.798 3.1662 2.512 9.9503-13.798-3.1662-2.512z",
      ],
      ["transform", "translate(-10.148 2.7584)"],
      ["class", "fill"],
    ],
  },
] as SVGAttributeObject[];

const fileExplorerPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 5 5 L 60 5 L 60 35 L 95 35 L 95 95 L 5 95 L 5 5 Z"],
      ["class", "stroke"],
      ["fill", "none"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 60 5 L 95 35 L 60 35 L 60 5 Z"],
      ["class", "fill stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 20 50 L 80 50"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 20 60 L 80 60"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 20 70 L 80 70"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
] as SVGAttributeObject[];

const samplesPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 5 5 L 95 5 L 95 95 L 5 95 L 5 5 Z"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ["d", "M 20 30 L 20 70"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },

  {
    attributes: [
      ["d", "M 35 40 L 35 60"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ["d", "M 50 25 L 50 75"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ["d", "M 65 40 L 65 60"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
  {
    attributes: [
      ["d", "M 80 45 L 80 55"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ],
  },
] as SVGAttributeObject[];

const closedPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 25 0 L 25 100 L 75 50 L 25 0 Z"],
      ["class", "fill"],
    ],
  },
] as SVGAttributeObject[];

const closePaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 10 10 L 90 90"],
      ["class", "stroke"],
      ["stroke-width", "10"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 90 10 L 10 90"],
      ["class", "stroke"],
      ["stroke-width", "10"],
    ],
  },
] as SVGAttributeObject[];

const homePaths = [
  {
    attributes: [
      ...universalAttributes,
      [
        "d",
        "M 50 5 L 95 50 L 95 95 L 65 95 L 65 50 L 35 50 L 35 95 L 5 95 L 5 50 L 50 5 Z",
      ],
      ["class", "stroke fill"],
      ["stroke-width", "4"],
    ],
  },
] as SVGAttributeObject[];

const playerPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 15 15 L 85 50 L 15 85 L 15 15 Z"],
      ["class", "stroke fill"],
      ["stroke-width", "7"],
    ],
  },
] as SVGAttributeObject[];

const editorPaths = [
  {
    attributes: [
      ...universalAttributes,
      [
        "d",
        "m135.5 71.119c0.86058 2.3555 1.6557 4.7442 5.7727 5.4479l-25.423 26.939-10.15 4.973 4.3775-10.421z",
      ],
      ["class", "fill"],
      ["transform", "translate(-105.7 -64.384)"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      [
        "d",
        "m141.86 64.384-4.5399 4.8106c0.71212 3.1799 2.7167 4.9055 5.7727 5.4479l4.5399-4.8106c-0.72325-2.9581-2.4914-4.9225-5.7727-5.4479z",
      ],
      ["class", "fill"],
      ["transform", "translate(-105.7 -64.384)"],
    ],
  },
] as SVGAttributeObject[];

const playPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 25 20 L 80 50 L 25 80 L 25 20 Z"],
      ["class", "stroke fill"],
    ],
  },
] as SVGAttributeObject[];

const pausePaths = [
  {
    attributes: [
      ["d", "M 30 20 L 30 80"],
      ["class", "stroke"],
      ["stroke-width", "15"],
    ],
  },
  {
    attributes: [
      ["d", "M 70 20 L 70 80"],
      ["class", "stroke"],
      ["stroke-width", "15"],
    ],
  },
] as SVGAttributeObject[];

const nextPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 25 20 L 80 50 L 25 80 L 25 20 Z"],
      ["class", "stroke fill"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 80 20 L 80 80"],
      ["class", "stroke"],
      ["stroke-width", "8"],
    ],
  },
] as SVGAttributeObject[];

const previousPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 80 20 L 20 50 L 80 80 L 80 20 Z"],
      ["class", "stroke fill"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 20 20 L 20 80"],
      ["class", "stroke"],
      ["stroke-width", "8"],
    ],
  },
] as SVGAttributeObject[];

const repeatPaths = [
  {
    attributes: [
      ...universalAttributes,
      ["d", "m84.378 106.52-7.6421 7.6175h15.284z"],
      ["class", "fill"],
      ["transform", "translate(-71.118 -100.41)"],
    ],
  },
  {
    attributes: [
      ...universalAttributes,
      [
        "d",
        "m84.378 103.67h21.134c2.7474 0 5.6132 2.7368 5.6132 5.7811v5.6452c0 2.8566-2.8658 5.7131-6.6868 5.7131h-20.061v-6.6653",
      ],
      ["class", "stroke"],
      ["stroke-width", "4"],
      ["transform", "translate(-71.118 -100.41)"],
    ],
  },
] as SVGAttributeObject[];

const addPaths = [
  {
    attributes: [
      ["d", "M 50 15 L 50 85"],
      ["class", "stroke"],
      ["stroke-width", "10"],
    ],
  },
  {
    attributes: [
      ["d", "M 15 50 L 85 50"],
      ["class", "stroke"],
      ["stroke-width", "10"],
    ],
  },
] as SVGAttributeObject[];

function buildPath(pathInfo: SVGAttributeObject) {
  const path = document.createElementNS(NAMESPACE_URI, "path");
  for (let attribute of pathInfo.attributes) {
    path.setAttribute(attribute[0], attribute[1]);
  }
  return path;
}

function buildSVG(vx: number, vy: number) {
  const svg = document.createElementNS(NAMESPACE_URI, "svg");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("viewBox", `0 0 ${vx} ${vy}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  return svg;
}

function buildIcon(
  pathAttributes: SVGAttributeObject[],
  vx: number,
  vy: number
) {
  const svg = buildSVG(vx, vy);
  pathAttributes.forEach((path) => {
    const pathSVG = buildPath(path);
    svg.appendChild(pathSVG);
  });
  return svg;
}

export function logo() {
  return buildIcon(logoPaths, 92.604, 92.604);
}

export function fileExplorer() {
  return buildIcon(fileExplorerPaths, 100, 100);
}

export function samples() {
  return buildIcon(samplesPaths, 100, 100);
}

export function closed() {
  return buildIcon(closedPaths, 100, 100);
}

export function close() {
  return buildIcon(closePaths, 100, 100);
}

export function home() {
  return buildIcon(homePaths, 100, 100);
}

export function player() {
  return buildIcon(playerPaths, 100, 100);
}

export function editor() {
  return buildIcon(editorPaths, 41.93, 44.095);
}

export function play() {
  return buildIcon(playPaths, 100, 100);
}

export function pause() {
  return buildIcon(pausePaths, 100, 100);
}

export function next() {
  return buildIcon(nextPaths, 100, 100);
}

export function previous() {
  return buildIcon(previousPaths, 100, 100);
}

export function repeat() {
  return buildIcon(repeatPaths, 48.077, 24.077);
}

export function add() {
  return buildIcon(addPaths, 100, 100);
}
