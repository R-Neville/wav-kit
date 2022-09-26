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
      ["d", "m40.659 5.8406-20.834 28.891 3.1662 2.5125 20.835-28.891-3.1667-2.512zm-11.962 2.4944-9.9503 13.798 3.1662 2.512 9.9503-13.797-3.1662-2.5125zm14.854 6.3443-14.302 19.833 3.1662 2.512 14.302-19.833-3.1667-2.512zm14.303 8.1199-11.153 1.8924-7.0549 9.6108c-0.49267 2.888-0.20184 4.7081 0.0894 6.5283 0.33455 1.8871 0.43413 3.5021-0.69401 7.5959-2.6684 8.2691-9.1652 16.374-16.17 24.245 0.88739 4.3159 5.3305 9.484 12.046 8.4398 5.2459-9.1866 10.879-17.679 18.1-22.904 3.6831-2.6345 5.2853-2.7665 7.1443-3.082 2.1815-0.5519 3.7181-0.63054 6.3609-2.0138 0.30364-0.08015 4.6787-6.9171 7.0549-9.6108l-1.9239-11.045-10.013 14.006c-5.7783-0.01257-10.59-2.8292-13.976-9.7808l10.19-13.881zm24.547 15.297-18.275 25.342 3.1662 2.512 18.275-25.342-3.1662-2.512zm8.586 0.99787-24.873 34.491 3.1662 2.512 24.873-34.49-3.1662-2.5125zm-2.0278 15.164-9.9503 13.798 3.1662 2.512 9.9503-13.798-3.1662-2.512z"],
      ["transform", "translate(-10.148 2.7584)"],
      ["class", "fill"]
    ]
  }
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
      ...universalAttributes,
      ["d", "M 20 30 L 20 70"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ]
  },
  
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 40 40 L 40 60"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ]
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 60 25 L 60 75"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ]
  },
  {
    attributes: [
      ...universalAttributes,
      ["d", "M 80 40 L 80 60"],
      ["class", "stroke"],
      ["stroke-width", "4"],
    ]
  }
] as SVGAttributeObject[];

const closedPaths = [
  {
    attributes: [
      ...universalAttributes,
      [ 'd', 'M 25 0 L 25 100 L 75 50 L 25 0 Z'],
      [ 'class', 'fill' ]
    ]
  }
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
