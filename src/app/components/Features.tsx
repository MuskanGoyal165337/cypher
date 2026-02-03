import { BarChart3, CloudLightning, Fingerprint, Globe, Layers, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: CloudLightning,
    title: "Lightning Fast",
    description: "Our optimized platform ensures zero latency, giving you real-time updates instantly."
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description: "Your data is encrypted end-to-end with enterprise-grade security protocols."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Gain deep insights into your performance with our powerful analytics dashboard."
  },
  {
    icon: Layers,
    title: "Seamless Integration",
    description: "Connect with your favorite tools effortlessly through our extensive API library."
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Access your data from anywhere in the world with our distributed content delivery network."
  },
  {
    icon: Fingerprint,
    title: "Secure Access",
    description: "Multi-factor authentication and biometric support to keep your account safe."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to scale
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to help your business grow and succeed in a competitive market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
