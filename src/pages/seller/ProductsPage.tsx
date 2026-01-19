import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { Button, Input, Textarea, ImageUpload, Badge, Modal } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Trash2, Edit, Search, Package, DollarSign } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 250px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 200px;
  background: ${({ $image }) => 
    $image ? `url(${$image}) center/cover` : 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 3rem;

  ${({ $image }) => 
    !$image && `
      svg {
        width: 48px;
        height: 48px;
      }
    `}
`;

const ProductContent = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'Couscous Royal',
    description: 'Savoureux couscous avec légumes frais et viande tendre',
    price: 2500,
    category: 'Plats principaux',
    image: 'https://via.placeholder.com/300x200?text=Couscous+Royal',
    stock: 15,
  },
  {
    id: '2',
    name: 'Tajine Agneau',
    description: 'Tajine traditionnel avec pruneaux et amandes',
    price: 2800,
    category: 'Plats principaux',
    image: 'https://via.placeholder.com/300x200?text=Tajine+Agneau',
    stock: 8,
  },
  {
    id: '3',
    name: 'Pâtisseries Traditionnelles',
    description: 'Assortiment de pâtisseries maison fraîches',
    price: 800,
    category: 'Desserts',
    image: 'https://via.placeholder.com/300x200?text=Patisseries',
    stock: 25,
  },
];

export const ProductsPage: React.FC = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });
  const [images, setImages] = useState<any[]>([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
    });
    setImages([]);
    setShowModal(true);
  };

  const handleEditProduct = (product: typeof mockProducts[0]) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleImagesChange = useCallback((imgs: any[]) => {
    setImages(imgs);
    if (imgs.length > 0 && imgs[0].previewUrl) {
      setFormData({ ...formData, image: imgs[0].previewUrl });
    }
  }, [formData]);

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال اسم المنتج' : 'Veuillez entrer le nom du produit');
      return;
    }
    if (!formData.description.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال وصف المنتج' : 'Veuillez entrer la description');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert(language === 'ar' ? 'الرجاء إدخال سعر صحيح' : 'Veuillez entrer un prix valide');
      return;
    }
    if (!formData.category.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال الفئة' : 'Veuillez entrer la catégorie');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert(language === 'ar' ? 'الرجاء إدخال كمية المخزون' : 'Veuillez entrer la quantité');
      return;
    }

    const imageUrl = images.length > 0 && images[0].previewUrl
      ? images[0].previewUrl
      : formData.image || 'https://via.placeholder.com/300x200?text=No+Image';

    if (editingId) {
      setProducts(products.map(p =>
        p.id === editingId
          ? {
              ...p,
              name: formData.name.trim(),
              description: formData.description.trim(),
              price: parseFloat(formData.price),
              category: formData.category.trim(),
              stock: parseInt(formData.stock),
              image: imageUrl,
            }
          : p
      ));
    } else {
      setProducts([
        ...products,
        {
          id: (products.length + 1).toString(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          category: formData.category.trim(),
          image: imageUrl,
          stock: parseInt(formData.stock),
        },
      ]);
    }
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
    });
    setImages([]);
  };

  return (
    <Layout showFooter={false}>
      <PageWrapper>
        <Container>
          <PageHeader>
            <PageTitle>
              {language === 'ar' ? 'إدارة المنتجات' : 'Gérer les produits'}
            </PageTitle>
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={handleAddProduct}>
              {language === 'ar' ? 'إضافة منتج' : 'Ajouter produit'}
            </Button>
          </PageHeader>

          <SearchBox>
            <Input
              placeholder={language === 'ar' ? 'البحث عن منتج...' : 'Rechercher un produit...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </SearchBox>

          {filteredProducts.length > 0 ? (
            <ProductsGrid>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductImage $image={product.image}>
                    {!product.image && <Package />}
                  </ProductImage>
                  <ProductContent>
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>{product.description}</ProductDescription>
                    <ProductMeta>
                      <MetaItem>
                        <DollarSign />
                        {language === 'ar' ? 'السعر' : 'Prix'}
                      </MetaItem>
                      <Badge variant="info" size="sm">
                        {product.stock} {language === 'ar' ? 'في المخزون' : 'en stock'}
                      </Badge>
                    </ProductMeta>
                    <PriceTag>{product.price} DA</PriceTag>
                    <ProductActions>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        onClick={() => handleEditProduct(product)}
                        fullWidth
                      >
                        {language === 'ar' ? 'تعديل' : 'Modifier'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        onClick={() => handleDeleteProduct(product.id)}
                        fullWidth
                      >
                        {language === 'ar' ? 'حذف' : 'Supprimer'}
                      </Button>
                    </ProductActions>
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductsGrid>
          ) : (
            <EmptyState>
              <Package />
              <p>
                {language === 'ar'
                  ? 'لا توجد منتجات متطابقة'
                  : 'Aucun produit trouvé'}
              </p>
            </EmptyState>
          )}

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: '',
              });
              setImages([]);
            }}
            title={editingId
              ? language === 'ar' ? 'تعديل المنتج' : 'Modifier produit'
              : language === 'ar' ? 'إضافة منتج جديد' : 'Ajouter un nouveau produit'}
            size="lg"
          >
              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'اسم المنتج' : 'Nom du produit'}
                </FormLabel>
                <Input
                  fullWidth
                  placeholder={language === 'ar' ? 'مثال: كسكسي ملكي' : 'Ex: Couscous Royal'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </FormLabel>
                <Textarea
                  placeholder={language === 'ar' ? 'وصف المنتج...' : 'Description du produit...'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'السعر (DA)' : 'Prix (DA)'}
                </FormLabel>
                <Input
                  fullWidth
                  type="number"
                  placeholder="2500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'الفئة' : 'Catégorie'}
                </FormLabel>
                <Input
                  fullWidth
                  placeholder={language === 'ar' ? 'مثال: الأطباق الرئيسية' : 'Ex: Plats principaux'}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'كمية المخزون' : 'Quantité en stock'}
                </FormLabel>
                <Input
                  fullWidth
                  type="number"
                  placeholder="15"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  {language === 'ar' ? 'صورة المنتج' : 'Image du produit'}
                </FormLabel>
                <ImageUpload
                  images={images}
                  onChange={handleImagesChange}
                  maxImages={1}
                  disabled={false}
                />
              </FormGroup>

              <FormActions>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      stock: '',
                      image: '',
                    });
                    setImages([]);
                  }}
                  fullWidth
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  fullWidth
                >
                  {language === 'ar' ? 'حفظ' : 'Enregistrer'}
                </Button>
              </FormActions>
            </Modal>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default ProductsPage;
