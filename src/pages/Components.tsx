import React from 'react';
import { ButtonVariants } from '@/components/design-system/ButtonVariants';
import { Toggle, Checkbox } from '@/components/design-system/ToggleCheckbox';
import { Tooltip } from '@/components/design-system/Tooltip';
import { InputField, Dropdown } from '@/components/design-system/InputFields';
import { NavigationSidebar } from '@/components/design-system/NavigationSidebar';
import { Filter, ViewOptions, RadioGroup, DisplayProperties } from '@/components/design-system/FilterView';
import { CommandBar } from '@/components/design-system/CommandBar';
import { IssueCard } from '@/components/design-system/IssueComponents';

const Components = () => {
  console.log('Components page is rendering - EMERGENCY DEBUG VERSION');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      backgroundColor: '#ffffff',
      position: 'relative',
      zIndex: 9999,
      display: 'block',
      visibility: 'visible',
      opacity: 1
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 10000
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>
            디자인 시스템 가이드
        </h1>
          <p style={{ color: '#666666', fontSize: '1.2rem' }}>
            일관된 사용자 경험을 위한 디자인 컴포넌트 라이브러리입니다.
          </p>
        </div>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
            개요
          </h2>
          <p style={{ color: '#666666', marginBottom: '1rem' }}>
            이 디자인 시스템은 일관된 사용자 인터페이스를 구축하기 위한 컴포넌트와 스타일 가이드라인을 제공합니다.
          </p>
          <p style={{ color: '#666666' }}>
            모든 컴포넌트는 Pretendard 폰트와 remixicon 아이콘을 사용하여 현대적이고 접근성이 뛰어난 디자인을 구현합니다.
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
            색상 팔레트
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { name: 'Purple', color: '#a855f7' },
              { name: 'Teal', color: '#14b8a6' },
              { name: 'Coral', color: '#ff6b6b' },
              { name: 'Red', color: '#ef4444' },
              { name: 'Olive', color: '#84cc16' },
              { name: 'Yellow', color: '#eab308' },
              { name: 'Orange', color: '#f97316' },
              { name: 'Mint', color: '#10b981' },
            ].map((color) => (
              <div key={color.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: color.color,
                  borderRadius: '0.5rem',
                  marginBottom: '0.25rem'
                }}></div>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>{color.name}</span>
            </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
            타이포그래피
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>안녕하세요! Simple Book입니다.</h1>
              <p style={{ fontSize: '0.875rem', color: '#666666' }}>Title 1 - 3rem, font-bold</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#000000' }}>안녕하세요! Simple Book입니다.</h2>
              <p style={{ fontSize: '0.875rem', color: '#666666' }}>Title 2 - 2.25rem, font-semibold</p>
              </div>
            <div>
              <h3 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#000000' }}>안녕하세요! Simple Book입니다.</h3>
              <p style={{ fontSize: '0.875rem', color: '#666666' }}>Title 3 - 1.875rem, font-semibold</p>
            </div>
            <div>
              <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '0.5rem' }}>안녕하세요! Simple Book입니다.</p>
              <p style={{ fontSize: '0.875rem', color: '#666666' }}>Body Large - 1.125rem</p>
            </div>
            <div>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>안녕하세요! Simple Book입니다.</p>
              <p style={{ fontSize: '0.875rem', color: '#666666' }}>Body Regular - 1rem</p>
            </div>
          </div>
        </div>

                {/* Button Variants */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Button Variants
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <ButtonVariants variant="primary">Get Started</ButtonVariants>
                    <ButtonVariants variant="secondary">Continue</ButtonVariants>
                    <ButtonVariants variant="destructive">Delete</ButtonVariants>
                    <ButtonVariants variant="ghost">Cancel</ButtonVariants>
                    <ButtonVariants variant="outline">Cancel</ButtonVariants>
                    <ButtonVariants variant="link">Try Now →</ButtonVariants>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <ButtonVariants variant="primary" icon="plus" iconPosition="left">New issue</ButtonVariants>
                    <ButtonVariants variant="secondary" icon="search">Search</ButtonVariants>
                    <ButtonVariants variant="ghost" icon="settings">Settings</ButtonVariants>
                    <ButtonVariants variant="primary" icon="star" iconPosition="right">Star</ButtonVariants>
                  </div>
                </div>

                {/* Toggle & Checkbox */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Toggle & Checkbox
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Toggle Switches</h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Toggle size="sm" label="Small Toggle" />
                        <Toggle size="md" label="Medium Toggle" defaultChecked />
                        <Toggle size="lg" label="Large Toggle" />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Checkboxes</h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Checkbox size="sm" label="Small Checkbox" />
                        <Checkbox size="md" label="Medium Checkbox" defaultChecked />
                        <Checkbox size="lg" label="Large Checkbox" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooltip */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Tooltip
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Tooltip content="This is a top tooltip" position="top">
                      <button style={{
                        backgroundColor: '#a855f7',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Hover me (Top)
                      </button>
                    </Tooltip>
                    <Tooltip content="This is a bottom tooltip" position="bottom">
                      <button style={{
                        backgroundColor: '#14b8a6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Hover me (Bottom)
                      </button>
                    </Tooltip>
                    <Tooltip content="This is a left tooltip" position="left">
                      <button style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Hover me (Left)
                      </button>
                    </Tooltip>
                    <Tooltip content="This is a right tooltip" position="right">
                      <button style={{
                        backgroundColor: '#84cc16',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Hover me (Right)
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Input Fields */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Input Fields
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Text Inputs</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <InputField label="Small Input" size="sm" placeholder="Small size" />
                        <InputField label="Medium Input" size="md" placeholder="Medium size" />
                        <InputField label="Large Input" size="lg" placeholder="Large size" />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Input States</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <InputField label="Normal Input" placeholder="Normal state" />
                        <InputField label="Error Input" placeholder="Error state" error="This field is required" />
                        <InputField label="Success Input" placeholder="Success state" helperText="Input is valid" />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Dropdown</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <Dropdown 
                          label="Select Option" 
                          placeholder="Choose an option"
                          options={[
                            { value: 'option1', label: 'Option 1' },
                            { value: 'option2', label: 'Option 2' },
                            { value: 'option3', label: 'Option 3' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Sidebar */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Navigation Sidebar
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '200px', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                      <NavigationSidebar />
                    </div>
                    <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                      <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                        Navigation Sidebar 컴포넌트가 왼쪽에 표시됩니다. 
                        사이드바의 메뉴 항목들을 클릭해보세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter View */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Filter View
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Filter Options</h3>
                      <Filter 
                        label="Status"
                        options={[
                          { id: 'open', label: 'Open', value: 'open', count: 12 },
                          { id: 'closed', label: 'Closed', value: 'closed', count: 8 },
                          { id: 'in-progress', label: 'In Progress', value: 'in-progress', count: 5 }
                        ]}
                        selectedValues={['open']}
                        onSelectionChange={() => {}}
                        multiple={true}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>View Options</h3>
                      <ViewOptions 
                        options={[
                          { id: 'list', label: 'List', value: 'list' },
                          { id: 'board', label: 'Board', value: 'board' },
                          { id: 'calendar', label: 'Calendar', value: 'calendar' }
                        ]}
                        selectedValue="list"
                        onSelectionChange={() => {}}
                      />
                    </div>
                  </div>
                </div>

                {/* Command Bar */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Command Bar
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <CommandBar />
                  </div>
                </div>

                {/* Issue Components */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#000000' }}>
                    Issue Components
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Issue Card</h3>
                      <div style={{ maxWidth: '400px' }}>
                        <IssueCard 
                          id="issue-1"
                          title="Fix login authentication bug"
                          description="Users are unable to log in with their credentials"
                          status="in-progress"
                          priority="high"
                          assignee={{
                            name: "John Doe",
                            avatar: "👤"
                          }}
                          labels={[
                            { id: "bug", name: "Bug", color: "#ef4444" },
                            { id: "auth", name: "Authentication", color: "#3b82f6" }
                          ]}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#000000' }}>Another Issue Card</h3>
                      <div style={{ maxWidth: '400px' }}>
                        <IssueCard 
                          id="issue-2"
                          title="Add dark mode support"
                          description="Implement dark mode toggle for better user experience"
                          status="todo"
                          priority="medium"
                          assignee={{
                            name: "Jane Smith",
                            avatar: "👩"
                          }}
                          labels={[
                            { id: "feature", name: "Feature", color: "#10b981" },
                            { id: "ui", name: "UI/UX", color: "#8b5cf6" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
      </div>
    </div>
  );
};

export default Components;