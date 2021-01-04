function drawSankey(graphId, data) {
  const _width = document.getElementById(graphId).getAttribute('width'),
    _height = document.getElementById(graphId).getAttribute('height');

  let margin = { top: 60, right: 10, bottom: 10, left: 80 },
    width = _width - margin.left - margin.right,
    height = _height - margin.top - margin.bottom;

  let fixToZero = d3.format(',.0f'),
    unit = 'Members',
    format = d => fixToZero(d) + ' ' + unit,
    // color = d3.scaleOrdinal(d3.schemeCategory10),
    _data = JSON.parse(data).data,
    _nodes = _data.nodes,
    _links = _data.links,
    _levels = _data.levels,
    _year = JSON.parse(data).year;

  const color = d3
    .scaleLinear()
    .domain([1, 2])
    .range(['#1a9850', '#d73027'])
    .interpolate(d3.interpolateHcl);

  let svg = d3
    .select('#' + graphId)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // .attr('style', 'background:#a9e2ea')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  let sankey = d3.sankey().nodeWidth(25).nodePadding(40).size([width, height]),
    linkPath = sankey.link();

  sankey.nodes(_nodes).links(_links).layout(100);

  let link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('.link')
    .data(_links)
    .enter()
    .append('a')
    .attr('class', 'drilldown-link')
    .attr('href', (d, i) => {
      const url = 'https://www.google.com/';
      return url;
    })
    .append('path')
    .attr('class', 'link')
    .attr('d', linkPath)
    .attr('stroke-width', d => Math.max(1, d.dy))
    .style('stroke', d => {
      const colorIndex = _levels.indexOf(d.source.name.replace(/ .*/, ''));
      return color(colorIndex);
    })
    .style('fill', 'none')
    // .style('stroke-opacity', 0.3)
    // .on('hover', () =>
    //   style({
    //     'stroke-opacity': 0.7,
    //   })
    // )
    .sort((a, b) => b.dy - a.dy);

  link
    .append('title')
    .text(d => d.source.name + ' → ' + d.target.name + '\n' + format(d.value));

  let node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('.node')
    .data(_nodes)
    .enter()
    .append('g')
    .attr('class', (_, i) => 'node-' + i)
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

  node
    .append('a')
    .attr('class', 'drilldown-node')
    .attr('href', () => {
      const url = 'https://d3js.org/';
      return url;
    })
    .append('rect')
    .attr('height', d => d.dy)
    .attr('width', sankey.nodeWidth())
    .style('fill', d => {
      const colorIndex = _levels.indexOf(d.name.replace(/ .*/, ''));
      return (d.color = color(colorIndex));
    })
    .style('stroke', d => d3.rgb(d.color).darker(2));

  node.append('title').text(d => d.name + '\n' + format(d.total));
  node
    .append('text')
    .attr('x', -6)
    .attr('dy', '.35em')
    .attr('y', d => d.dy / 2)
    .attr('text-anchor', 'end')
    .filter(d => d.year === 'p3')
    .text(d => d.name);

  const points = ['p3', 'p2', 'p1'];

  const dataPoint = svg
    .append('g')
    .attr('class', 'date-point')
    .selectAll('.date-point')
    .data([100, 350, 550])
    .enter()
    .append('g');

  dataPoint
    .attr('transform', d => 'translate(' + d + ',' + -30 + ')')
    .append('text')
    .attr('x', 20)
    .attr('text-anchor', (d, i) => {
      if (i === 0) {
        return 'end';
      } else if (i === 1) {
        return 'middle';
      } else if (i === 2) {
        return 'start';
      }
    })
    .text((_, i) => _year[points[i]]);

  return;
}
