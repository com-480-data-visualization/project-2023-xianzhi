var chartDom = document.getElementById('chart-container');
var myChart = echarts.init(chartDom);
var option;
fetch("data/counts.json")
  .then(response => response.json())
  .then(json => {    
    var colors = ["steelblue", "green", "red", "orange", "purple"];
    
    var nodes = [
        {'name': 'Staten Island','itemStyle':{'color':"steelblue"}},
        {'name': 'Bronx','itemStyle':{'color':"green"}},
        {'name': 'Manhattan','itemStyle':{'color':"red"}},
        {'name': 'Brooklyn','itemStyle':{'color':"orange"}},
        {'name': 'Queens','itemStyle':{'color':"purple"}},
    ];
    var links = [];
    json.forEach(function(item) {
      var sourceNode = nodes.find(function(node) {
        return node.name === item.source;
      });
    
      if (!sourceNode) {
        if(item.source === "")
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
            triggerOn: 'mousemove',
            formatter: function(arg) {
                if(arg.dataType === "node"){
                    console.log(arg);
                    return arg.data.name + ': Total post number: ' + arg.value;
                }
                return arg.data.source + ' - ' + arg.data.target+ ': Post number: ' + arg.data.value ;
            }
        },
        series: {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: nodes,
          links: links,
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                opacity: 0.7,
              },
              lineStyle: {
                color: "gradient",
                opacity: 0.6,
              },
            },
            {
              depth: 1,
              lineStyle: {
                color: "gradient",
                opacity: 0.6,
              },
            }
            ]
        },
        
      };
      
      option && myChart.setOption(option);
  });

