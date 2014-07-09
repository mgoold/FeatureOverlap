FeatureOverlap
==============

FeatureOverlap is a custom client-side d3.js visualization that shows the co-usage of features (for example, the activities that users do together on a site).  It is like a bar chart, except that it gives each distinct permutation of co-used features a unique vertical space.  The volume of users (or visits, etc) that do that permutation is shown by the relative vertical height.  This lets you visually pop out the most co-used features among all possible co-uses in a very obvious way, and d3.js scalability lets you show co-occurence for a large features.  I was able to do it comfortably for 12 site activities, 12 months, and ~2.5 million users per month (not 2.5M data points).
