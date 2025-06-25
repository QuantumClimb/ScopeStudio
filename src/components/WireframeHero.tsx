
interface WireframeHeroProps {
  title: string;
  subheading: string;
  imageUrl?: string;
}

export const WireframeHero = ({ title, subheading, imageUrl }: WireframeHeroProps) => {
  return (
    <section 
      className="py-20 relative"
      style={{
        backgroundImage: imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div 
        className={`max-w-7xl mx-auto px-6 text-center ${
          imageUrl ? 'text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100'
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            imageUrl ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
          </h1>
          <p className={`text-xl mb-8 ${
            imageUrl ? 'text-gray-100' : 'text-gray-600'
          }`}>
            {subheading}
          </p>
          
          {/* CTA buttons placeholder */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium">
              Primary CTA
            </div>
            <div className={`border px-8 py-3 rounded-lg font-medium ${
              imageUrl 
                ? 'border-white text-white hover:bg-white hover:text-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              Secondary CTA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
