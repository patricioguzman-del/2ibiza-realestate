'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MapProperty {
  _id: string
  title: string
  slug: { current: string }
  price?: number
  priceOnRequest?: boolean
  area?: { name: string }
  coordinates: { lat: number; lng: number }
  heroImageUrl?: string | null
}

interface PropertyMapViewProps {
  properties: MapProperty[]
  /** Number of filtered properties skipped because they have no coordinates */
  noCoords?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMapPrice(price?: number, priceOnRequest?: boolean): string {
  if (priceOnRequest || !price) return 'P.O.R.'
  if (price >= 1000000) return `€${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`
  return `€${(price / 1000).toFixed(0)}K`
}

function buildPopupHtml(p: MapProperty): string {
  const price = formatMapPrice(p.price, p.priceOnRequest)
  const area  = p.area?.name ?? ''
  return `
    <div class="map-popup">
      ${p.heroImageUrl
        ? `<img src="${p.heroImageUrl}" alt="${p.title}" class="map-popup__img" />`
        : `<div class="map-popup__img-placeholder"></div>`
      }
      <div class="map-popup__body">
        ${area ? `<p class="map-popup__area">${area}</p>` : ''}
        <p class="map-popup__title">${p.title}</p>
        <p class="map-popup__price">${price}</p>
        <a href="/properties/${p.slug.current}" class="map-popup__link">View Property →</a>
      </div>
    </div>
  `
}

function addMarkersToGroup(L: any, group: any, props: MapProperty[]): void {
  group.clearLayers()
  props.forEach(p => {
    if (!p.coordinates?.lat || !p.coordinates?.lng) return

    const price = formatMapPrice(p.price, p.priceOnRequest)
    const icon  = L.divIcon({
      html:        `<div class="map-price-pill">${price}</div>`,
      className:   'map-icon-host',
      iconSize:    [0, 0],
      iconAnchor:  [0, 0],
      popupAnchor: [0, -8],
    })

    const marker = L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
    marker.bindPopup(buildPopupHtml(p), {
      maxWidth:  220,
      minWidth:  200,
      className: 'map-popup-container',
      offset:    [0, -4],
    })
    group.addLayer(marker)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertyMapView({ properties, noCoords = 0 }: PropertyMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any>(null)
  const initDoneRef  = useRef(false)

  // Init map once on mount
  useEffect(() => {
    let mounted = true

    ;(async () => {
      const L = (await import('leaflet')).default
      if (!mounted || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        center:             [38.96, 1.43],
        zoom:               11,
        zoomControl:        false,
        attributionControl: true,
      })
      map.attributionControl.setPrefix('')
      L.control.zoom({ position: 'topright' }).addTo(map)

      // CartoDB Light — minimal, editorial aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a> © <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
        subdomains: 'abcd',
        maxZoom:    19,
      }).addTo(map)

      mapRef.current     = map
      markersRef.current = L.layerGroup().addTo(map)
      initDoneRef.current = true

      // Add initial markers
      addMarkersToGroup(L, markersRef.current, properties)
    })()

    return () => {
      mounted = false
      mapRef.current?.remove()
      mapRef.current      = null
      markersRef.current  = null
      initDoneRef.current = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when properties change after mount
  useEffect(() => {
    if (!initDoneRef.current || !markersRef.current) return
    ;(async () => {
      const L = (await import('leaflet')).default
      if (!markersRef.current) return
      addMarkersToGroup(L, markersRef.current, properties)
    })()
  }, [properties])

  return (
    <div style={{ position: 'relative' }}>
      {/* Map canvas */}
      <div
        ref={containerRef}
        style={{
          height:    'calc(100svh - 68px - 116px)',
          minHeight: '480px',
          width:     '100%',
        }}
      />

      {/* No-coordinates notice */}
      {noCoords > 0 && (
        <div
          style={{
            position:        'absolute',
            bottom:          '20px',
            left:            '50%',
            transform:       'translateX(-50%)',
            backgroundColor: 'rgba(255,253,249,0.92)',
            backdropFilter:  'blur(8px)',
            border:          '1px solid var(--border-soft)',
            borderRadius:    'var(--radius-sm)',
            padding:         '8px 16px',
            zIndex:          1000,
            whiteSpace:      'nowrap',
          }}
        >
          <p className="type-caption" style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
            {noCoords} {noCoords === 1 ? 'property' : 'properties'} not shown — coordinates not yet set
          </p>
        </div>
      )}

      {/* Empty state when no mappable properties */}
      {properties.length === 0 && (
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            pointerEvents:  'none',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255,253,249,0.92)',
              backdropFilter:  'blur(8px)',
              border:          '1px solid var(--border-soft)',
              borderRadius:    'var(--radius-md)',
              padding:         '24px 32px',
              textAlign:       'center',
            }}
          >
            <p className="font-serif" style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              No properties to show
            </p>
            <p className="type-caption" style={{ color: 'var(--text-tertiary)', marginBottom: 0 }}>
              Try adjusting your filters
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
