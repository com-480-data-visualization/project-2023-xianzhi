var chartDom = document.getElementById('chart-container');
var myChart = echarts.init(chartDom);
var option;
fetch("data/counts.json")
  .then(response => response.json())
  .then(json => {    
    var nodes = [];
    var links = [];
    json.forEach(function(item) {
      var sourceNode = nodes.find(function(node) {
        return node.name === item.source;
      });
    
      if (!sourceNode) {
        sourceNode = { name: item.source };
        nodes.push(sourceNode);
      }
    
      var targetNode = nodes.find(function(node) {
        return node.name === item.target;
      });
    
      if (!targetNode) {
        targetNode = { name: item.target };
        nodes.push(targetNode);
      }
    
      links.push({
        source: item.source,
        target: item.target,
        value: item.value
      });
    });

    option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: nodes,
          links: links
        },
        lineStyle: {
          color: 'source',
          curveness: 0.5
        }
      };
      
      option && myChart.setOption(option);
  });

