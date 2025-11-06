import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ArrowRight, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Climate-Smart Agriculture: A Comprehensive Guide",
    excerpt: "Learn how climate-smart agriculture can help farmers adapt to climate change while increasing productivity and sustainability.",
    content: `Climate-smart agriculture (CSA) represents a transformative approach to farming that addresses three interconnected pillars: increasing agricultural productivity and incomes, building resilience to climate change, and reducing greenhouse gas emissions where possible.

    In today's rapidly changing climate, farmers face unprecedented challenges. Rising temperatures, shifting rainfall patterns, and increased frequency of extreme weather events threaten food security worldwide. Climate-smart agriculture offers a pathway forward by integrating traditional knowledge with innovative technologies and practices.

    The core principles of CSA include: improving water management through efficient irrigation systems, enhancing soil health through organic amendments and conservation tillage, diversifying crop varieties to spread risk, and implementing agroforestry systems that sequester carbon while providing additional income streams.

    Successful implementation requires a holistic approach that considers local context, available resources, and community needs. Farmers who adopt CSA practices often see improved yields, reduced input costs, and greater resilience to climate shocks. Technology plays a crucial role, from weather forecasting tools to precision agriculture equipment that optimizes resource use.

    The transition to climate-smart agriculture isn't just about environmental sustainability—it's about ensuring long-term food security and viable livelihoods for farming communities worldwide. By embracing these practices today, we're building a more resilient agricultural future for generations to come.`,
    author: "Kasainie Lekireu",
    date: "2024-03-15",
    category: "Climate Science",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop"
  },
  {
    id: "2",
    title: "AI-Powered Crop Disease Detection: The Future of Farming",
    excerpt: "Discover how artificial intelligence is revolutionizing crop health monitoring and disease prevention in modern agriculture.",
    content: `Artificial intelligence is transforming how farmers detect and manage crop diseases, potentially saving billions in lost harvests while reducing environmental impact through targeted pesticide application.

    Traditional disease detection relied heavily on manual scouting—a time-consuming process requiring expert knowledge and often resulting in late detection when damage was already extensive. AI-powered image recognition changes this paradigm entirely. Using smartphone cameras or drone-mounted sensors, farmers can now capture images of their crops and receive instant diagnostic feedback powered by sophisticated machine learning algorithms.

    These AI systems are trained on vast databases containing millions of images of healthy and diseased plants across numerous crop species. They can identify subtle visual cues that even experienced agronomists might miss, detecting diseases in their earliest stages when intervention is most effective and least costly.

    The benefits extend beyond early detection. AI systems provide actionable recommendations for treatment, predict disease spread based on weather patterns and field conditions, and help farmers maintain detailed health records for their crops. Some advanced platforms even integrate with precision spraying equipment, ensuring pesticides are applied only where needed.

    In developing regions where access to agricultural experts is limited, AI-powered disease detection democratizes expertise. A smallholder farmer in rural Kenya can access the same diagnostic capabilities as a large commercial operation, leveling the playing field and improving food security.

    As these systems continue to learn and improve, incorporating new diseases and crop varieties, they become increasingly accurate and valuable. The future of farming is intelligent, data-driven, and more sustainable than ever before.`,
    author: "Kasainie Lekireu",
    date: "2024-03-10",
    category: "Technology",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Maximizing Water Efficiency in Modern Irrigation Systems",
    excerpt: "Explore innovative irrigation techniques that help conserve water while maintaining optimal crop yields in varying climate conditions.",
    content: `Water scarcity is one of agriculture's most pressing challenges. With agriculture consuming approximately 70% of global freshwater withdrawals, maximizing irrigation efficiency isn't just environmentally responsible—it's economically essential.

    Modern irrigation technology has evolved far beyond simple sprinkler systems. Today's smart irrigation platforms integrate real-time weather data, soil moisture sensors, and crop water requirements to deliver precise amounts of water exactly when and where needed. This precision approach can reduce water consumption by 30-50% while actually improving crop yields.

    Drip irrigation systems represent one of the most efficient methods, delivering water directly to plant roots with minimal evaporation loss. When combined with soil moisture sensors and weather-based controllers, these systems achieve remarkable efficiency. Farmers report significant reductions in water bills while seeing healthier plants and higher yields.

    Variable rate irrigation takes efficiency further by adjusting water application rates across different field zones based on soil type, topography, and crop needs. GPS-guided systems can account for variations within a single field, ensuring every section receives optimal moisture.

    Deficit irrigation strategies, where crops intentionally receive less than full water requirements during certain growth stages, can actually improve crop quality and water productivity. Research shows that strategic water stress during specific phenological stages can enhance fruit quality, sugar content, and even disease resistance.

    The future of irrigation lies in predictive analytics. AI-powered systems analyze historical data, current conditions, and weather forecasts to optimize irrigation schedules days in advance. These systems learn from each season, continuously improving their recommendations and adapting to changing climate patterns.`,
    author: "Kasainie Lekireu",
    date: "2024-03-05",
    category: "Water Management",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Soil Health: The Foundation of Sustainable Agriculture",
    excerpt: "Understanding soil composition and health is crucial for long-term farming success. Learn how to assess and improve your soil quality.",
    content: `Healthy soil is the cornerstone of productive agriculture. Far from being mere dirt, soil is a complex ecosystem teeming with billions of microorganisms, minerals, organic matter, water, and air—all working together to support plant growth.

    Soil health encompasses physical, chemical, and biological properties that enable soil to function as a vital living ecosystem. Physical properties include soil structure, porosity, and water-holding capacity. Chemical properties involve pH levels, nutrient availability, and cation exchange capacity. Biological properties encompass the diverse community of organisms that cycle nutrients and suppress diseases.

    Assessing soil health begins with observation. Healthy soil has good structure with visible aggregates, earthworm activity, and a rich earthy smell. Laboratory testing provides quantitative data on nutrient levels, organic matter content, and pH. Increasingly, farmers are also conducting biological assessments, measuring microbial biomass and diversity as indicators of soil vitality.

    Improving soil health requires a multifaceted approach. Adding organic amendments like compost or manure increases organic matter, improves soil structure, and feeds beneficial microbes. Cover cropping protects soil from erosion, adds organic matter, and can fix atmospheric nitrogen. Reducing tillage preserves soil structure and protects microbial communities from disruption.

    Crop rotation plays a crucial role in maintaining soil health by diversifying root systems, breaking pest and disease cycles, and balancing nutrient demands. Different crops contribute different organic compounds to the soil, supporting diverse microbial communities.

    The benefits of healthy soil extend beyond the farm. Healthy soils sequester carbon, filter water, and support biodiversity. They're more resilient to drought and extreme weather, providing farmers with greater stability in an uncertain climate. Investing in soil health is investing in agricultural sustainability and long-term profitability.`,
    author: "Kasainie Lekireu",
    date: "2024-02-28",
    category: "Soil Science",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop"
  },
  {
    id: "5",
    title: "Weather Forecasting for Farmers: Making Data-Driven Decisions",
    excerpt: "Learn how to leverage modern weather forecasting tools to optimize planting, harvesting, and crop protection strategies.",
    content: `Weather is agriculture's most unpredictable variable. The difference between a bumper crop and a failed harvest often comes down to timing decisions around planting, irrigation, fertilization, and harvest—all of which depend heavily on weather conditions.

    Modern weather forecasting has become remarkably sophisticated, offering farmers unprecedented insight into upcoming conditions. High-resolution models can predict temperature, precipitation, wind, and humidity at the field level, with useful accuracy extending 7-10 days ahead. For strategic planning, seasonal outlooks provide probabilistic forecasts months in advance.

    Successful farmers use weather data proactively across every stage of production. Planting decisions consider soil temperature forecasts and upcoming rainfall probability. Irrigation scheduling accounts for predicted precipitation, maximizing efficiency and minimizing runoff. Fertilizer applications are timed to coincide with optimal soil moisture and temperature conditions for nutrient uptake.

    Pest and disease management increasingly relies on weather-based prediction models. Many crop diseases require specific temperature and humidity conditions to develop. By monitoring weather forecasts and using disease prediction models, farmers can apply protective treatments only when conditions favor disease development, reducing unnecessary pesticide applications.

    Harvest timing represents one of weather forecasting's most valuable applications. Forecasts help farmers identify optimal harvest windows when crops are at peak quality and weather conditions allow efficient field operations. This is particularly critical for crops sensitive to moisture, where harvest delays during wet conditions can result in significant quality losses.

    Mobile apps and SMS services now deliver customized weather alerts and recommendations directly to farmers' phones. These tools integrate local weather station data, forecast models, and crop-specific knowledge to provide actionable advice tailored to each farm's unique conditions and crops.`,
    author: "Kasainie Lekireu",
    date: "2024-02-20",
    category: "Weather",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop"
  },
  {
    id: "6",
    title: "Integrated Pest Management: Natural Solutions for Crop Protection",
    excerpt: "Reduce chemical pesticide use while effectively managing pests through integrated pest management strategies and biological controls.",
    content: `Integrated Pest Management (IPM) represents a paradigm shift from calendar-based, prophylactic pesticide applications to a holistic, ecologically-based approach that combines multiple tactics to keep pest populations below economically damaging levels.

    The foundation of IPM is monitoring and accurate identification. Regular scouting helps farmers understand pest populations, beneficial insect levels, and damage thresholds. Not every pest requires control—many populations remain below levels that cause economic damage. By monitoring carefully and using established action thresholds, farmers apply controls only when truly necessary.

    Cultural controls form IPM's first line of defense. Crop rotation disrupts pest life cycles, preventing buildup of host-specific pests. Proper timing of planting and harvest can help crops avoid peak pest pressure. Selecting resistant varieties provides inherent protection without any additional inputs. Maintaining field sanitation by removing crop residues eliminates pest habitat between seasons.

    Biological controls harness nature's own pest management systems. Beneficial insects like ladybugs, lacewings, and parasitic wasps prey on crop pests. Establishing habitat that supports these beneficial species—such as flowering borders and beetle banks—creates natural pest suppression. Some farmers purchase and release beneficial organisms to augment natural populations.

    Mechanical and physical controls include barriers, traps, and manual removal. Row covers protect young plants from flying insects. Pheromone traps disrupt mating or monitor pest populations. Careful tillage can expose soil-dwelling pests to predators or harsh weather.

    Chemical controls remain an IPM option but are used judiciously as a last resort. When necessary, farmers select the least toxic, most targeted products and apply them at optimal timing to maximize effectiveness while minimizing non-target impacts. Many IPM programs have successfully reduced pesticide use by 50% or more while maintaining or improving pest control and crop quality.`,
    author: "Kasainie Lekireu",
    date: "2024-02-15",
    category: "Pest Management",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop"
  },
  {
    id: "7",
    title: "The Role of Data Analytics in Modern Farming",
    excerpt: "Big data and analytics are transforming agriculture. Discover how farmers use data to increase efficiency and profitability.",
    content: `Agriculture is experiencing a data revolution. Modern farms generate vast amounts of information from diverse sources: yield monitors on harvest equipment, sensors measuring soil conditions, satellite imagery tracking crop health, weather stations recording microclimate data, and financial systems tracking costs and revenues.

    The real power lies not in collecting data but in transforming it into actionable insights. Data analytics platforms aggregate information from multiple sources, identify patterns, and generate recommendations that improve decision-making across all aspects of farm management.

    Yield prediction models analyze historical production data, current season weather patterns, soil conditions, and crop health indicators to forecast harvest volumes weeks or months in advance. These predictions enable better marketing decisions, helping farmers time sales to maximize prices and secure advantageous contracts.

    Precision agriculture relies heavily on data analytics to optimize input applications. Variable rate application maps, generated from yield data, soil tests, and crop health imagery, guide equipment to apply fertilizers, seeds, and pesticides at optimal rates across different field zones. This targeted approach reduces input costs while improving crop performance and environmental outcomes.

    Financial analytics help farmers understand true costs of production and profitability at the enterprise and field level. By tracking inputs, labor, equipment costs, and yields, farmers identify their most and least profitable crops and fields. This insight drives strategic decisions about crop selection, land rental, and capital investment.

    Predictive maintenance analytics monitor equipment performance, identifying potential failures before they occur. Sensors track engine hours, fuel consumption, vibration patterns, and other indicators. Analytics platforms flag anomalies and schedule preventive maintenance, reducing costly breakdowns during critical periods like planting and harvest.

    The future of agricultural data analytics includes AI-powered advisory systems that continuously learn from farm-specific data, providing increasingly personalized and accurate recommendations as they accumulate more information about each unique operation.`,
    author: "Kasainie Lekireu",
    date: "2024-02-10",
    category: "Technology",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?w=800&h=400&fit=crop"
  },
  {
    id: "8",
    title: "Crop Rotation Strategies for Soil Fertility and Pest Control",
    excerpt: "Implementing effective crop rotation can naturally improve soil health, break pest cycles, and increase overall farm productivity.",
    content: `Crop rotation—the practice of growing different crops in sequence on the same field—is one of agriculture's oldest and most effective practices for maintaining soil fertility and managing pests without external inputs.

    The fundamental principle is diversity. Different crops have different nutrient requirements, root structures, and associated pest complexes. By rotating crops systematically, farmers balance nutrient demands, improve soil structure, and disrupt pest and disease cycles.

    Nutrient management through rotation centers on balancing heavy feeders with light feeders and nitrogen fixers. Corn, for example, demands high nitrogen levels. Following corn with soybeans—which fix atmospheric nitrogen through symbiotic bacteria—naturally replenishes soil nitrogen without synthetic fertilizers. A subsequent small grain crop can utilize the residual nitrogen efficiently.

    Root system diversity improves soil structure across depth profiles. Deep-rooted crops like alfalfa penetrate compacted layers and mine nutrients from depth, making them available to subsequent shallow-rooted crops when roots decompose. Fibrous-rooted grasses improve aggregate stability, while taprooted crops create channels that improve water infiltration and aeration.

    Pest and disease management benefits are substantial. Most pests and pathogens are host-specific. Corn rootworm, for instance, requires corn to complete its life cycle. Breaking the corn-on-corn sequence interrupts this cycle, dramatically reducing populations without insecticides. Similarly, many soil-borne diseases build up when the same crop grows repeatedly in one location. Rotation starves these pathogens of suitable hosts, reducing disease pressure.

    Effective rotation planning considers market opportunities, equipment availability, labor requirements, and environmental conditions alongside agronomic benefits. Many farmers develop rotations spanning three to six years, balancing short-term profitability with long-term soil health and sustainability. The most successful rotations incorporate cover crops between cash crops, providing additional diversity and soil health benefits.`,
    author: "Kasainie Lekireu",
    date: "2024-02-05",
    category: "Best Practices",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop"
  },
  {
    id: "9",
    title: "Climate Adaptation Strategies for Small-Scale Farmers",
    excerpt: "Practical approaches to help small-scale farmers adapt to changing climate patterns and maintain food security.",
    content: `Small-scale farmers are on the frontlines of climate change, facing increased temperatures, erratic rainfall, and more frequent extreme weather events. Yet they often lack resources for expensive adaptation technologies. Fortunately, proven strategies exist that are accessible and effective for farmers at all scales.

    Diversification represents the cornerstone of climate adaptation. Growing multiple crops spreads risk across different climate sensitivities. If drought damages the main crop, alternative crops with different water requirements may still succeed. Integrating livestock with crops creates additional income streams and provides organic fertilizer. Agroforestry systems combine crops with trees, providing shade, windbreaks, additional products, and carbon sequestration.

    Water management adaptation focuses on capturing and conserving precious rainfall. Simple rainwater harvesting systems—from small farm ponds to contour bunds that slow runoff—extend water availability through dry periods. Mulching reduces evaporation from soil surfaces. Conservation agriculture practices like minimum tillage preserve soil moisture and improve infiltration.

    Shifting planting dates helps crops avoid extreme weather events and align critical growth stages with favorable conditions. Farmers are planting earlier or later than traditional schedules to avoid heat stress during flowering or grain fill. Some are adopting short-duration crop varieties that mature before end-of-season droughts typically occur.

    Soil health improvement increases resilience to both drought and flooding. Soils high in organic matter hold more water during dry periods and have better structure to absorb intense rainfall without erosion. Adding compost, using cover crops, and reducing tillage all build soil organic matter over time.

    Access to climate information is crucial. Seasonal forecasts help farmers plan crop selections and planting dates. Real-time weather information allows tactical decisions about irrigation, pest management, and harvest timing. Farmer field schools and agricultural extension services play vital roles in helping farmers interpret and apply climate information effectively.`,
    author: "Kasainie Lekireu",
    date: "2024-01-30",
    category: "Climate Science",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=400&fit=crop"
  },
  {
    id: "10",
    title: "Organic Farming: Benefits, Challenges, and Success Stories",
    excerpt: "Explore the world of organic farming, its environmental benefits, economic considerations, and inspiring success stories from around the world.",
    content: `Organic farming has evolved from a niche movement to a significant force in global agriculture, driven by growing consumer demand for food produced without synthetic pesticides, fertilizers, or genetically modified organisms.

    The environmental benefits are substantial and well-documented. Organic farms support greater biodiversity, with more beneficial insects, birds, and soil organisms than conventional operations. The prohibition on synthetic pesticides protects water quality and ecosystem health. Building soil organic matter through composting and cover cropping sequester carbon, helping mitigate climate change. Organic practices typically reduce energy consumption by eliminating energy-intensive synthetic fertilizer production.

    Soil health improvement stands among organic farming's greatest contributions. Organic farmers invest heavily in compost, cover crops, and crop rotations—practices that build soil organic matter, improve structure, and enhance biological activity. These soils show greater resilience to drought and flooding, providing adaptation benefits as climate becomes more variable.

    Economic considerations present both opportunities and challenges. Organic products command premium prices, often 20-50% above conventional equivalents. These premiums can offset higher labor costs and sometimes lower yields, making organic farming economically viable and often more profitable than conventional approaches. However, transition periods between conventional and certified organic production can be financially challenging, as farmers implement organic practices before being able to market products as organic.

    Pest and weed management without synthetic chemicals requires knowledge, planning, and often more labor. Successful organic farmers employ sophisticated integrated pest management strategies, combining crop rotation, beneficial insect habitat, careful timing, and targeted organic-approved inputs. Mechanical weed control and hand weeding replace herbicides, increasing labor requirements but providing employment in rural communities.

    Success stories abound globally. In India, smallholder farmers adopting organic practices report improved soil health, reduced input costs, and premium prices that substantially increase incomes. European organic farms demonstrate that high productivity and environmental stewardship can coexist. These examples prove that organic agriculture can be both ecologically sound and economically viable.`,
    author: "Kasainie Lekireu",
    date: "2024-01-25",
    category: "Organic Farming",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&h=400&fit=crop"
  },
  {
    id: "11",
    title: "Smart Sensors and IoT in Agriculture: A Game Changer",
    excerpt: "IoT sensors are revolutionizing farm monitoring by providing real-time data on soil moisture, temperature, and crop health.",
    content: `The Internet of Things (IoT) is transforming agriculture by connecting physical sensors and devices to digital networks, enabling unprecedented monitoring, automation, and optimization of farming operations.

    Soil moisture sensors represent one of IoT's most practical agricultural applications. Wireless sensors installed at various depths continuously measure soil water content, transmitting data to cloud platforms accessible via smartphone. Farmers receive real-time information about soil moisture status across different field zones, enabling precise irrigation decisions that conserve water while maintaining optimal crop conditions.

    Weather monitoring has evolved beyond single farm stations to networks of IoT-connected sensors providing hyperlocal data. Temperature, humidity, rainfall, wind speed, and leaf wetness sensors create detailed microclimatic pictures. This granular information powers disease prediction models, frost warnings, and optimal spray timing recommendations specific to each field's unique conditions.

    Crop health monitoring through IoT-connected multispectral sensors detects stress before visible to the human eye. These sensors measure light reflection across different wavelengths, identifying nutrient deficiencies, water stress, or disease development in early stages when intervention is most effective and least costly.

    Livestock monitoring applications include GPS tracking collars that monitor animal location and activity patterns. Changes in movement or feeding behavior can indicate health issues, allowing early intervention. Automated feeding systems adjust rations based on individual animal needs, optimizing nutrition and reducing waste.

    Storage facility monitoring protects harvested crops and farm inputs. IoT sensors track temperature and humidity in grain bins, alerting farmers to conditions favoring mold or insect activity. This prevents spoilage and maintains crop quality from harvest through marketing.

    The real power emerges when multiple sensor streams integrate into comprehensive farm management platforms. AI algorithms analyze data from soil sensors, weather stations, crop monitors, and equipment telemetry together, generating insights impossible from any single data source. These integrated systems are evolving toward autonomous decision-making, where irrigation systems, fertilizer applicators, and other equipment respond automatically to sensor data without human intervention.`,
    author: "Kasainie Lekireu",
    date: "2024-01-20",
    category: "Technology",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1473830394358-91588751b241?w=800&h=400&fit=crop"
  },
  {
    id: "12",
    title: "Sustainable Fertilization: Balancing Nutrition and Environment",
    excerpt: "Learn about sustainable fertilization practices that maintain soil fertility while minimizing environmental impact and costs.",
    content: `Fertilization represents one of agriculture's greatest environmental challenges and opportunities. While essential for crop nutrition and food production, excessive or poorly timed fertilizer application causes water pollution, greenhouse gas emissions, and economic waste. Sustainable fertilization practices optimize crop nutrition while minimizing environmental impact.

    The foundation is understanding crop nutrient requirements and soil nutrient supply. Soil testing reveals available nutrient levels, allowing farmers to apply only what crops actually need. Tissue testing during the growing season confirms whether nutrient uptake is occurring as planned, enabling mid-season corrections if necessary.

    The 4R nutrient stewardship framework—Right Source, Right Rate, Right Time, Right Place—guides sustainable fertilization decisions. Right Source means selecting fertilizer forms appropriate for soil conditions and crop needs. Slow-release formulations, for instance, reduce leaching losses on sandy soils. Right Rate involves applying amounts that match crop requirements without excess. Over-application wastes money and increases environmental risk without improving yields.

    Right Time synchronizes fertilizer application with crop demand. Split applications—dividing total fertilizer into multiple smaller applications timed to crop growth stages—improve uptake efficiency dramatically. Applying nitrogen when crops are actively growing and can use it immediately reduces losses to leaching or volatilization.

    Right Place means positioning fertilizer where crop roots can access it. Banding fertilizer near seed at planting concentrates nutrients in the root zone, improving early season nutrition. Subsurface injection reduces surface losses and protects water quality better than broadcast applications.

    Organic nutrient sources play crucial roles in sustainable systems. Manure, compost, and crop residues return nutrients to soil while building organic matter and supporting soil biology. Cover crops, especially legumes, fix atmospheric nitrogen, providing free fertilizer for subsequent crops. Green manures and crop rotations with nitrogen-fixing species can substantially reduce synthetic fertilizer requirements.

    Precision agriculture technologies enable variable rate fertilization, applying different rates across different field zones based on soil test results, yield maps, and crop health imagery. This site-specific approach puts nutrients exactly where needed, eliminating over-application in high-fertility zones while adequately supplying areas with greater needs.`,
    author: "Kasainie Lekireu",
    date: "2024-01-15",
    category: "Soil Science",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&h=400&fit=crop"
  }
];

const categories = [
  "All",
  "Climate Science",
  "Technology",
  "Water Management",
  "Soil Science",
  "Weather",
  "Pest Management",
  "Best Practices",
  "Organic Farming"
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ClimaSmart</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ClimaSmart Blog</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, tips, and stories about climate-smart agriculture, sustainable farming practices, and agricultural technology
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b bg-background/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group/btn" asChild>
                    <Link to={`/blog/${post.id}`} className="flex items-center justify-center gap-2">
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Subscribe to Our Newsletter</CardTitle>
              <CardDescription>
                Get the latest articles, tips, and insights about climate-smart agriculture delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ClimaSmart</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with climate-smart solutions for sustainable agriculture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:+254795872528" className="hover:text-primary transition-colors">Phone: 0795872528</a></li>
                <li><a href="mailto:kasainielekireu@gmail.com" className="hover:text-primary transition-colors">Email: kasainielekireu@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ClimaSmart. Created by Kasainie Lekireu. Empowering farmers with climate-smart solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Import useState
import { useState } from "react";

export default Blog;
