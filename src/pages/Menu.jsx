import { useState } from 'react'
import { categories } from '../data/menuData'
import './Menu.css'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  const currentCategory = categories.find((c) => c.id === activeCategory)

  return (
    <section className="section menu-section">
      <div className="container">
        <h1 className="section-title">Carta</h1>

        <div className="menu-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-items">
          {currentCategory?.items.map((item, i) => (
            <div key={i} className="menu-item">
              <div className="menu-item-info">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-desc">{item.description}</p>
              </div>
              <span className="menu-item-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
