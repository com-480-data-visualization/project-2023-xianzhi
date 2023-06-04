let App = {

    // Fetch all the elements we need
    projects : document.querySelectorAll('.project'),

    // INIT FUNCTION
    init : function(){
        this.particle();
        this.masonry();
    },

    // START THE PARTICLES BACKGROUNDS
    particle : function()
    {
        particlesJS.load('particles', 'assets/js/particle.json', function() {
            console.log('callback - particles.js config loaded');
        });
        particlesJS.load('particles2', 'assets/js/particle.json', function() {
            console.log('callback - particles.js config loaded');
        });
    },

    // PORTFOLIO
    masonry : function()
    {

        // Set up a bunch of variables we'll use to sort the projects
        let leftColumn   = [];
        let rightColumn  = [];
        let leftColumnH  = null;
        let rightColumnH = null;

        for (let i = 0; i < this.projects.length; i++)
        {   
            let h = Math.ceil(this.projects[i].getBoundingClientRect().height);
            
            // If the taller column is the left one
            if (leftColumnH <= rightColumnH)
            {
                // Add element height to the total column height
                leftColumnH += h;

                // Add current element to that column
                leftColumn.push(this.projects[i]);
            } 

            // Or if it's the right one
            else
            {
                // Add element height to the total column height
                rightColumnH += h;
                rightColumn.push(this.projects[i]);
            };
        };

        // MERGE THE TWO COLUMNS
        let sortedContent = leftColumn.concat(rightColumn);
        document.querySelector('.portfolio-grid').innerHTML = null;
        for (let i = 0; i < sortedContent.length; i++)
        {
            document.querySelector('.portfolio-grid').appendChild(sortedContent[i]);
        }

    }

};

App.init();

