import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, Container } from '../../components/layout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  Star,
  ShoppingBag,
  Store,
  Truck,
  Clock,
  TrendingUp,
  Heart,
  ChevronRight,
} from 'lucide-react';

// Types
type SearchType = 'all' | 'product' | 'store' | 'service' | 'restaurant';

interface SearchResult {
  id: string;
  type: 'product' | 'store' | 'service' | 'restaurant';
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  price?: number;
  distance?: number;
  category?: string;
  isOpen?: boolean;
}

interface SearchFilters {
  query: string;
  type: SearchType;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  sortBy: 'relevance' | 'rating' | 'price' | 'distance';
}

// Styled Components
const ExploreWrapper = styled.div`
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SearchSection = styled.div`
  background: ${({ theme }) => theme.colors.bg.secondary};
  padding: 1.5rem;
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.text.secondary};
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.darkGreen}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const TypeTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const TypeTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 2rem;
  border: 2px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLighter};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? 'white' : theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary.darkGreen : theme.colors.primary.darkGreen + '10'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLight};
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    
    span {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-weight: 400;
    }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ResultCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ResultImage = styled.div<{ $image: string }>`
  height: 180px;
  background: ${({ $image }) => `url(${$image})`} center/cover;
  position: relative;
`;

const ResultBadge = styled.span<{ $type: string }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $type }) => {
    switch ($type) {
      case 'product': return '#2D6A4F';
      case 'store': return '#FFC300';
      case 'restaurant': return '#FF6B6B';
      case 'service': return '#4ECDC4';
      default: return '#6B7280';
    }
  }};
  color: white;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
    color: #6B7280;
  }
  
  &:hover svg {
    color: #FF6B6B;
  }
`;

const ResultContent = styled.div`
  padding: 1.25rem;
`;

const ResultName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #FFC300;
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const ResultDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResultFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.darkGreenHover};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9375rem;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const TrendingSection = styled.div`
  margin-top: 3rem;
`;

const TrendingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const TrendingTags = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const TrendingTag = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.darkGreen};
    color: white;
  }
`;

// Mock data for demonstration
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'product',
    name: 'Organic Fresh Vegetables Box',
    description: 'Fresh organic vegetables delivered to your doorstep. Includes tomatoes, lettuce, carrots, and more.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    rating: 4.8,
    reviewCount: 234,
    price: 2500,
    category: 'Food',
  },
  {
    id: '2',
    type: 'store',
    name: 'Green Market Store',
    description: 'Your local organic grocery store with fresh produce and sustainable products.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    rating: 4.6,
    reviewCount: 567,
    distance: 2.5,
    isOpen: true,
  },
  {
    id: '3',
    type: 'restaurant',
    name: 'Café Délice',
    description: 'Authentic French cuisine with a modern twist. Perfect for lunch and dinner.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    rating: 4.9,
    reviewCount: 890,
    distance: 1.2,
    isOpen: true,
  },
  {
    id: '4',
    type: 'service',
    name: 'Express Delivery Service',
    description: 'Same-day delivery service for all your urgent packages and documents.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400',
    rating: 4.5,
    reviewCount: 123,
    price: 500,
  },
  {
    id: '5',
    type: 'product',
    name: 'Handmade Ceramic Set',
    description: 'Beautiful handcrafted ceramic dining set. Includes 4 plates, 4 bowls, and 4 cups.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    rating: 4.7,
    reviewCount: 89,
    price: 8500,
    category: 'Home',
  },
  {
    id: '6',
    type: 'store',
    name: 'Tech Zone Electronics',
    description: 'Your one-stop shop for all electronics, gadgets, and tech accessories.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    rating: 4.4,
    reviewCount: 345,
    distance: 3.8,
    isOpen: false,
  },
];

const trendingSearches = [
  'Fresh vegetables',
  'Electronics',
  'Restaurant near me',
  'Delivery service',
  'Organic food',
  'Home decor',
  'Fast food',
  'Gift ideas',
];

// Component
export const ExplorePage: React.FC = () => {
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    sortBy: 'relevance',
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Filter results based on search criteria
  const filteredResults = useMemo(() => {
    if (!filters.query.trim()) return [];
    
    return mockResults.filter((result) => {
      // Filter by type
      if (filters.type !== 'all' && result.type !== filters.type) {
        return false;
      }
      
      // Filter by query
      const query = filters.query.toLowerCase();
      const matchesName = result.name.toLowerCase().includes(query);
      const matchesDesc = result.description.toLowerCase().includes(query);
      const matchesCategory = result.category?.toLowerCase().includes(query);
      
      if (!matchesName && !matchesDesc && !matchesCategory) {
        return false;
      }
      
      // Filter by rating
      if (filters.ratingMin && result.rating < filters.ratingMin) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        default:
          return 0;
      }
    });
  }, [filters]);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
    if (query.trim()) {
      setHasSearched(true);
    }
  }, []);

  const handleTypeChange = useCallback((type: SearchType) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const handleTrendingClick = useCallback((tag: string) => {
    setFilters((prev) => ({ ...prev, query: tag }));
    setHasSearched(true);
  }, []);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Navigate based on result type
    switch (result.type) {
      case 'product':
        navigate(`/product/${result.id}`);
        break;
      case 'store':
        navigate(`/store/${result.id}`);
        break;
      case 'restaurant':
        navigate(`/restaurant/${result.id}`);
        break;
      case 'service':
        navigate(`/service/${result.id}`);
        break;
    }
  }, [isLoggedIn, navigate]);

  const typeOptions: { value: SearchType; label: string; labelAr: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', labelAr: 'الكل', icon: <Search /> },
    { value: 'product', label: 'Products', labelAr: 'المنتجات', icon: <ShoppingBag /> },
    { value: 'store', label: 'Stores', labelAr: 'المتاجر', icon: <Store /> },
    { value: 'restaurant', label: 'Restaurants', labelAr: 'المطاعم', icon: <Clock /> },
    { value: 'service', label: 'Services', labelAr: 'الخدمات', icon: <Truck /> },
  ];

  return (
    <Layout onExploreClick={() => {}}>
      <ExploreWrapper>
        <Container>
          <PageHeader>
            <h1>{language === 'fr' ? 'Explore' : 'استكشف'}</h1>
            <p>
              {language === 'fr'
                ? 'Search for products, stores, restaurants, and services'
                : 'ابحث عن المنتجات والمتاجر والمطاعم والخدمات'}
            </p>
          </PageHeader>

          <SearchSection>
            <SearchInputWrapper>
              <Search />
              <SearchInput
                type="text"
                placeholder={
                  language === 'fr'
                    ? 'Search for anything...'
                    : 'ابحث عن أي شيء...'
                }
                value={filters.query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchInputWrapper>

            <TypeTabs>
              {typeOptions.map((option) => (
                <TypeTab
                  key={option.value}
                  $active={filters.type === option.value}
                  onClick={() => handleTypeChange(option.value)}
                >
                  {option.icon}
                  {language === 'fr' ? option.label : option.labelAr}
                </TypeTab>
              ))}
            </TypeTabs>

            <FiltersRow>
              <FilterSelect
                value={filters.sortBy}
                title={language === 'fr' ? 'Sort options' : 'خيارات الترتيب'}
                aria-label={language === 'fr' ? 'Sort options' : 'خيارات الترتيب'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as SearchFilters['sortBy'],
                  }))
                }
              >
                <option value="relevance">
                  {language === 'fr' ? 'Sort by: Relevance' : 'ترتيب: الصلة'}
                </option>
                <option value="rating">
                  {language === 'fr' ? 'Sort by: Rating' : 'ترتيب: التقييم'}
                </option>
                <option value="price">
                  {language === 'fr' ? 'Sort by: Price' : 'ترتيب: السعر'}
                </option>
                <option value="distance">
                  {language === 'fr' ? 'Sort by: Distance' : 'ترتيب: المسافة'}
                </option>
              </FilterSelect>

              <FilterSelect
                value={filters.ratingMin || ''}
                title={language === 'fr' ? 'Filter by rating' : 'تصفية حسب التقييم'}
                aria-label={language === 'fr' ? 'Filter by rating' : 'تصفية حسب التقييم'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    ratingMin: e.target.value ? parseFloat(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">
                  {language === 'fr' ? 'All Ratings' : 'جميع التقييمات'}
                </option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="3">3+ ⭐</option>
              </FilterSelect>
            </FiltersRow>
          </SearchSection>

          {hasSearched && filters.query.trim() && (
            <ResultsSection>
              <ResultsHeader>
                <h2>
                  {filteredResults.length} {language === 'fr' ? 'results' : 'نتيجة'}
                  <span> {language === 'fr' ? 'for' : 'عن'} "{filters.query}"</span>
                </h2>
              </ResultsHeader>

              {filteredResults.length > 0 ? (
                <ResultsGrid>
                  <AnimatePresence>
                    {filteredResults.map((result, index) => (
                      <ResultCard
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                      >
                        <ResultImage $image={result.image}>
                          <ResultBadge $type={result.type}>
                            {result.type}
                          </ResultBadge>
                          <FavoriteButton
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite
                            }}
                          >
                            <Heart />
                          </FavoriteButton>
                        </ResultImage>
                        <ResultContent>
                          <ResultName>{result.name}</ResultName>
                          <ResultMeta>
                            <Rating>
                              <Star />
                              {result.rating} ({result.reviewCount})
                            </Rating>
                            {result.distance && (
                              <>
                                <MapPin size={14} />
                                {result.distance} km
                              </>
                            )}
                          </ResultMeta>
                          <ResultDescription>{result.description}</ResultDescription>
                          <ResultFooter>
                            {result.price ? (
                              <ResultPrice>{result.price} DA</ResultPrice>
                            ) : (
                              <span></span>
                            )}
                            <ViewButton>
                              {language === 'fr' ? 'View' : 'عرض'}
                              <ChevronRight />
                            </ViewButton>
                          </ResultFooter>
                        </ResultContent>
                      </ResultCard>
                    ))}
                  </AnimatePresence>
                </ResultsGrid>
              ) : (
                <EmptyState>
                  <Search />
                  <h3>{language === 'fr' ? 'No results found' : 'لا توجد نتائج'}</h3>
                  <p>
                    {language === 'fr'
                      ? 'Try different keywords or browse our trending searches below.'
                      : 'جرب كلمات مختلفة أو تصفح عمليات البحث الشائعة أدناه.'}
                  </p>
                </EmptyState>
              )}
            </ResultsSection>
          )}

          <TrendingSection>
            <TrendingHeader>
              <TrendingUp />
              <h2>{language === 'fr' ? 'Trending Searches' : 'عمليات البحث الشائعة'}</h2>
            </TrendingHeader>
            <TrendingTags>
              {trendingSearches.map((tag) => (
                <TrendingTag key={tag} onClick={() => handleTrendingClick(tag)}>
                  {tag}
                </TrendingTag>
              ))}
            </TrendingTags>
          </TrendingSection>
        </Container>
      </ExploreWrapper>
    </Layout>
  );
};

export default ExplorePage;
